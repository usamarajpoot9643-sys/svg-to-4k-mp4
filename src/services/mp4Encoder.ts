import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import type { VideoSettings, ConversionProgress, ExportResult, BackgroundConfig } from '../types/config';
import { normalizeSvgForResolution } from './svgParser';

// List of AVC/H.264 profile strings in order of preference for high resolution / 4K
const AVC_PROFILES = [
  'avc1.640033', // High Profile, Level 5.1 (Up to 4K @ 60fps)
  'avc1.640034', // High Profile, Level 5.2
  'avc1.4d0033', // Main Profile, Level 5.1
  'avc1.420033', // Baseline Profile, Level 5.1
  'avc1.64002a', // High Profile, Level 4.2
  'avc1.4d002a', // Main Profile, Level 4.2
  'avc1.42001f', // Baseline Profile, Level 3.1 (universal fallback)
];

/**
 * Discovers the best supported H.264 profile for the given resolution & frame rate.
 */
async function findSupportedCodec(
  width: number,
  height: number,
  fps: number,
  bitrate: number
): Promise<string> {
  if (typeof VideoEncoder === 'undefined') {
    return 'avc1.640033';
  }

  for (const codec of AVC_PROFILES) {
    try {
      const config: VideoEncoderConfig = {
        codec,
        width,
        height,
        bitrate,
        framerate: fps,
      };
      const support = await VideoEncoder.isConfigSupported(config);
      if (support.supported) {
        return codec;
      }
    } catch {
      // Continue to next candidate
    }
  }

  return 'avc1.640033';
}

/**
 * Renders the chosen background onto the 2D canvas context.
 */
function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  bg: BackgroundConfig | string
): void {
  ctx.save();
  if (typeof bg === 'string') {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
  } else if (bg.type === 'solid') {
    ctx.fillStyle = bg.color;
    ctx.fillRect(0, 0, width, height);
  } else if (bg.type === 'gradient') {
    const { angle, startColor, endColor, type } = bg.gradient;
    if (type === 'radial') {
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) / 1.5
      );
      grad.addColorStop(0, startColor);
      grad.addColorStop(1, endColor);
      ctx.fillStyle = grad;
    } else {
      const rad = ((angle - 90) * Math.PI) / 180;
      const length = Math.abs(width * Math.sin(rad)) + Math.abs(height * Math.cos(rad));
      const cx = width / 2;
      const cy = height / 2;
      const x0 = cx - (Math.cos(rad) * length) / 2;
      const y0 = cy - (Math.sin(rad) * length) / 2;
      const x1 = cx + (Math.cos(rad) * length) / 2;
      const y1 = cy + (Math.sin(rad) * length) / 2;

      const grad = ctx.createLinearGradient(x0, y0, x1, y1);
      grad.addColorStop(0, startColor);
      grad.addColorStop(1, endColor);
      ctx.fillStyle = grad;
    }
    ctx.fillRect(0, 0, width, height);
  } else {
    // Transparent mode: MP4 video baseline requires deep black opaque canvas
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);
  }
  ctx.restore();
}

/**
 * Verifies that the canvas actually rendered non-zero visible pixels across 5 sampled zones.
 */
function verifyCanvasHasPixels(ctx: CanvasRenderingContext2D, width: number, height: number): boolean {
  try {
    const sampleSize = 100;
    const testPoints = [
      { x: Math.floor(width / 2 - sampleSize / 2), y: Math.floor(height / 2 - sampleSize / 2) },
      { x: Math.floor(width / 4 - sampleSize / 2), y: Math.floor(height / 4 - sampleSize / 2) },
      { x: Math.floor((3 * width) / 4 - sampleSize / 2), y: Math.floor(height / 4 - sampleSize / 2) },
      { x: Math.floor(width / 4 - sampleSize / 2), y: Math.floor((3 * height) / 4 - sampleSize / 2) },
      { x: Math.floor((3 * width) / 4 - sampleSize / 2), y: Math.floor((3 * height) / 4 - sampleSize / 2) },
    ];

    let coloredPixelsCount = 0;
    for (const pt of testPoints) {
      const imgData = ctx.getImageData(
        Math.max(0, pt.x),
        Math.max(0, pt.y),
        Math.min(sampleSize, width),
        Math.min(sampleSize, height)
      );
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        // Non-zero alpha and non-pure-black
        if (a > 0 && (r > 10 || g > 10 || b > 10)) {
          coloredPixelsCount++;
          if (coloredPixelsCount > 30) return true;
        }
      }
    }
    return coloredPixelsCount > 30;
  } catch {
    return true; // Ignore if security restricted
  }
}

/**
 * Mirrors the current 4K canvas frame onto the live on-screen monitor inside ProgressModal.
 */
function mirrorToLivePreviewCanvas(sourceCanvas: HTMLCanvasElement): void {
  const previewCanvas = document.getElementById('live-recording-preview-canvas') as HTMLCanvasElement | null;
  if (!previewCanvas) return;
  const pCtx = previewCanvas.getContext('2d');
  if (!pCtx) return;
  pCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
  pCtx.drawImage(sourceCanvas, 0, 0, previewCanvas.width, previewCanvas.height);
}

/**
 * Strict Deterministic SVG Frame Stepping.
 * Injects explicit root dimensions (targetWidth x targetHeight),
 * enforces frame-accurate CSS keyframe time stepping using negative animation-delay,
 * and awaits hardware image decode to guarantee zero blank/flicker frames.
 */
async function renderFrameToCanvas(
  svgString: string,
  currentTimeSec: number,
  ctx: CanvasRenderingContext2D,
  targetWidth: number,
  targetHeight: number,
  backgroundColor: BackgroundConfig | string
): Promise<void> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const svgEl = doc.documentElement;

  // Enforce resolution
  svgEl.setAttribute('width', `${targetWidth}`);
  svgEl.setAttribute('height', `${targetHeight}`);

  if (!svgEl.getAttribute('xmlns')) {
    svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }
  if (!svgEl.getAttribute('xmlns:xlink')) {
    svgEl.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  }

  // Lock all CSS keyframes to the exact current timestamp
  const styleEl = doc.createElementNS('http://www.w3.org/2000/svg', 'style');
  styleEl.textContent = `* { 
    animation-delay: -${currentTimeSec}s !important; 
    animation-play-state: paused !important; 
  }`;
  svgEl.appendChild(styleEl);

  // Synchronize SMIL animations if present
  const smilNodes = svgEl.querySelectorAll('animate, animateTransform, animateMotion, set');
  smilNodes.forEach((smil) => {
    if (!smil.hasAttribute('data-orig-begin')) {
      smil.setAttribute('data-orig-begin', smil.getAttribute('begin') || '0s');
    }
    const orig = smil.getAttribute('data-orig-begin') || '0s';
    const origNum = parseFloat(orig) || 0;
    smil.setAttribute('begin', `${(origNum - currentTimeSec).toFixed(4)}s`);
  });

  const serializedSVG = new XMLSerializer().serializeToString(doc);
  const blob = new Blob([serializedSVG], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const img = new Image();
  img.src = url;

  // Hardware decode await guarantees zero blank/flicker frames
  try {
    await img.decode();
  } catch {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = (e) => reject(new Error(`Failed to decode SVG frame: ${e}`));
    });
  }

  // Clear canvas & fill solid background
  drawBackground(ctx, targetWidth, targetHeight, backgroundColor);

  // Draw the time-locked frame
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  URL.revokeObjectURL(url);
}

export interface ConvertSvgOptions {
  svgCode: string;
  settings: VideoSettings;
  isAnimated: boolean;
  onProgress: (progress: ConversionProgress) => void;
  signal?: AbortSignal;
}

/**
 * Fallback converter using HTML5 Canvas captureStream and MediaRecorder
 * for browsers where WebCodecs VideoEncoder is unavailable.
 */
async function convertSvgWithMediaRecorder(
  options: ConvertSvgOptions,
  canvas: HTMLCanvasElement
): Promise<ExportResult> {
  const { svgCode, settings, onProgress, signal } = options;
  const targetWidth = canvas.width;
  const targetHeight = canvas.height;
  const fps = settings.fps;
  const duration = settings.duration;
  const totalFrames = Math.max(1, Math.round(duration * fps));
  const bitrate = settings.bitrate;

  const rawCtx = canvas.getContext('2d', { alpha: false });
  if (!rawCtx) {
    throw new Error('Failed to acquire 2D canvas context.');
  }
  const ctx: CanvasRenderingContext2D = rawCtx;

  const stream = canvas.captureStream(fps);

  let chosenMime = 'video/mp4; codecs="avc1.4d002a"';
  if (typeof MediaRecorder !== 'undefined') {
    if (!MediaRecorder.isTypeSupported(chosenMime)) {
      chosenMime = 'video/mp4';
    }
    if (!MediaRecorder.isTypeSupported(chosenMime)) {
      chosenMime = 'video/webm; codecs=vp9';
    }
    if (!MediaRecorder.isTypeSupported(chosenMime)) {
      chosenMime = 'video/webm';
    }
  }

  const chunks: Blob[] = [];
  const recorder = new MediaRecorder(stream, {
    mimeType: chosenMime,
    videoBitsPerSecond: bitrate,
  });

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  recorder.start();
  const startTime = performance.now();
  const normalizedSvg = normalizeSvgForResolution(svgCode, targetWidth, targetHeight);

  for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
    if (signal?.aborted) {
      recorder.stop();
      throw new DOMException('Export cancelled by user', 'AbortError');
    }

    const currentTime = frameIndex / fps;

    // Strict deterministic render to canvas
    await renderFrameToCanvas(normalizedSvg, currentTime, ctx, targetWidth, targetHeight, settings.background);

    // Mirror to on-screen preview monitor
    mirrorToLivePreviewCanvas(canvas);

    // Keep event loop responsive
    await new Promise((r) => setTimeout(r, 0));

    const framesEncoded = frameIndex + 1;
    const elapsedSec = (performance.now() - startTime) / 1000;
    const currentFps = framesEncoded / (elapsedSec || 0.001);
    const remainingFrames = totalFrames - framesEncoded;
    const remainingSec = currentFps > 0 ? remainingFrames / currentFps : 0;
    const percentage = Math.round((framesEncoded / totalFrames) * 100);

    onProgress({
      stage: 'encoding',
      currentFrame: framesEncoded,
      totalFrames,
      percentage,
      fpsRate: Math.round(currentFps * 10) / 10,
      elapsedSeconds: Math.round(elapsedSec * 10) / 10,
      remainingSeconds: Math.round(remainingSec * 10) / 10,
      statusMessage: `MediaRecorder: Frame ${framesEncoded}/${totalFrames} (${percentage}%)`,
    });
  }

  recorder.stop();

  const finalBlob = await new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: chosenMime.includes('mp4') ? 'video/mp4' : 'video/webm' }));
    };
  });

  const timestamp = Date.now();
  const ext = chosenMime.includes('mp4') ? 'mp4' : 'webm';
  const filename = `svg-render-${targetWidth}x${targetHeight}-${fps}fps-${timestamp}.${ext}`;
  const downloadUrl = URL.createObjectURL(finalBlob);

  return {
    blob: finalBlob,
    url: downloadUrl,
    filename,
    fileSizeBytes: finalBlob.size,
    width: targetWidth,
    height: targetHeight,
    duration,
    fps,
    bitrate,
    timestamp,
  };
}

/**
 * High-performance 4K MP4 Conversion Pipeline using WebCodecs + mp4-muxer.
 * Uses strict deterministic SVG frame stepping with negative animation-delay
 * and hardware image decode to eliminate black-flashes and animation freezes.
 */
export async function convertSvgToMp4(options: ConvertSvgOptions): Promise<ExportResult> {
  const { svgCode, settings, onProgress, signal } = options;

  const targetWidth = settings.customWidth % 2 === 0 ? settings.customWidth : settings.customWidth + 1;
  const targetHeight = settings.customHeight % 2 === 0 ? settings.customHeight : settings.customHeight + 1;
  const fps = settings.fps;
  const duration = settings.duration;
  // Mathematical total frames: e.g. 5s @ 60fps = exactly 300 frames
  const totalFrames = Math.max(1, Math.round(duration * fps));
  const bitrate = settings.bitrate;

  // 1. Initial status
  onProgress({
    stage: 'parsing',
    currentFrame: 0,
    totalFrames,
    percentage: 0,
    fpsRate: 0,
    elapsedSeconds: 0,
    remainingSeconds: 0,
    statusMessage: 'Normalizing vector dimensions & initializing GPU encoder...',
  });

  if (signal?.aborted) {
    throw new DOMException('Export cancelled by user', 'AbortError');
  }

  // 2. Normalize SVG
  const normalizedSvg = normalizeSvgForResolution(svgCode, targetWidth, targetHeight);

  // 3. Create reusable 4K HTML5 Canvas buffer
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const rawCtx = canvas.getContext('2d', { alpha: false, desynchronized: true });
  if (!rawCtx) {
    throw new Error('Failed to acquire 2D canvas context for rendering.');
  }
  const ctx: CanvasRenderingContext2D = rawCtx;

  // Fallback to MediaRecorder if WebCodecs VideoEncoder is unavailable
  if (typeof VideoEncoder === 'undefined') {
    try {
      return await convertSvgWithMediaRecorder(options, canvas);
    } finally {
      canvas.width = 0;
      canvas.height = 0;
    }
  }

  const chosenCodec = await findSupportedCodec(targetWidth, targetHeight, fps, bitrate);

  // 4. Set up mp4-muxer with explicit container framerate
  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: {
      codec: 'avc',
      width: targetWidth,
      height: targetHeight,
      frameRate: fps, // Declares 60 FPS in container header
    },
    fastStart: 'in-memory',
    firstTimestampBehavior: 'strict',
  });

  let encoderError: Error | null = null;

  // 5. Set up WebCodecs VideoEncoder
  const videoEncoder = new VideoEncoder({
    output: (chunk, meta) => {
      muxer.addVideoChunk(chunk, meta);
    },
    error: (err) => {
      encoderError = err;
      console.error('WebCodecs VideoEncoder error:', err);
    },
  });

  videoEncoder.configure({
    codec: chosenCodec,
    width: targetWidth,
    height: targetHeight,
    bitrate: bitrate,
    framerate: fps,
    latencyMode: 'quality',
    avc: { format: 'avc' },
  });

  const startTime = performance.now();
  let lastProgressUpdate = performance.now();

  try {
    onProgress({
      stage: 'rasterizing',
      currentFrame: 0,
      totalFrames,
      percentage: 0,
      fpsRate: 0,
      elapsedSeconds: 0,
      remainingSeconds: 0,
      statusMessage: `Deterministic render: Frame 1 of ${totalFrames} (target ${fps} FPS)...`,
    });

    // Initial event loop yield to ensure modal is mounted and ready
    await new Promise<void>((resolve) => setTimeout(resolve, 10));

    // VideoFrame Dispatch Loop with strict deterministic SVG frame stepping
    for (let i = 0; i < totalFrames; i++) {
      if (signal?.aborted) {
        throw new DOMException('Export cancelled by user', 'AbortError');
      }

      if (encoderError) {
        throw encoderError;
      }

      const currentTime = i / fps;

      // 1. Strict deterministic frame render with hardware decode await
      await renderFrameToCanvas(normalizedSvg, currentTime, ctx, targetWidth, targetHeight, settings.background);

      // 2. Verify non-zero pixel rendering on frame 0
      if (i === 0) {
        const hasPixels = verifyCanvasHasPixels(ctx, targetWidth, targetHeight);
        if (!hasPixels) {
          console.warn('Canvas verification warning: low pixel density detected in frame 0.');
        }
      }

      // 3. Instantiate VideoFrame strictly after renderFrameToCanvas completes
      const frame = new VideoFrame(canvas, {
        timestamp: (i * 1_000_000) / fps,
        duration: 1_000_000 / fps,
      });

      const isKeyframe = (i % (fps * 2) === 0);
      videoEncoder.encode(frame, { keyFrame: isKeyframe });
      frame.close();

      // Backpressure: If encoder queue is getting backed up, wait for queue drain
      if (videoEncoder.encodeQueueSize > 4) {
        await new Promise<void>((resolve) => {
          videoEncoder.ondequeue = () => resolve();
        });
      }

      // Keep event loop responsive
      await new Promise((r) => setTimeout(r, 0));

      // Periodic UI progress update and preview mirroring
      const now = performance.now();
      if (now - lastProgressUpdate > 60 || i === totalFrames - 1) {
        lastProgressUpdate = now;
        mirrorToLivePreviewCanvas(canvas);

        const elapsedSec = (now - startTime) / 1000;
        const framesEncoded = i + 1;
        const currentFpsRate = framesEncoded / (elapsedSec || 0.001);
        const remainingFrames = totalFrames - framesEncoded;
        const remainingSec = currentFpsRate > 0 ? remainingFrames / currentFpsRate : 0;
        const percentage = Math.round((framesEncoded / totalFrames) * 100);

        onProgress({
          stage: 'encoding',
          currentFrame: framesEncoded,
          totalFrames,
          percentage,
          fpsRate: Math.round(currentFpsRate * 10) / 10,
          elapsedSeconds: Math.round(elapsedSec * 10) / 10,
          remainingSeconds: Math.round(remainingSec * 10) / 10,
          statusMessage: `Rendering: Frame ${framesEncoded}/${totalFrames} (${percentage}%) - ${Math.round(currentFpsRate)} fps`,
        });
      }
    }

    // Stage: Finalizing MP4 container
    onProgress({
      stage: 'finalizing',
      currentFrame: totalFrames,
      totalFrames,
      percentage: 100,
      fpsRate: Math.round((totalFrames / ((performance.now() - startTime) / 1000)) * 10) / 10,
      elapsedSeconds: Math.round(((performance.now() - startTime) / 1000) * 10) / 10,
      remainingSeconds: 0,
      statusMessage: 'Flushing encoder & multiplexing MP4 container...',
    });

    // Flush encoder to make sure all chunks are received
    await videoEncoder.flush();
    videoEncoder.close();

    // Finalize muxer
    muxer.finalize();

    const mp4Buffer = muxer.target.buffer;
    const mp4Blob = new Blob([mp4Buffer], { type: 'video/mp4' });
    const downloadUrl = URL.createObjectURL(mp4Blob);

    const timestamp = Date.now();
    const filename = `svg-render-${targetWidth}x${targetHeight}-${fps}fps-${timestamp}.mp4`;

    const result: ExportResult = {
      blob: mp4Blob,
      url: downloadUrl,
      filename,
      fileSizeBytes: mp4Blob.size,
      width: targetWidth,
      height: targetHeight,
      duration,
      fps,
      bitrate,
      timestamp,
    };

    onProgress({
      stage: 'done',
      currentFrame: totalFrames,
      totalFrames,
      percentage: 100,
      fpsRate: Math.round((totalFrames / ((performance.now() - startTime) / 1000)) * 10) / 10,
      elapsedSeconds: Math.round(((performance.now() - startTime) / 1000) * 10) / 10,
      remainingSeconds: 0,
      statusMessage: 'Conversion completed successfully!',
    });

    return result;
  } catch (error) {
    try {
      videoEncoder.close();
    } catch {
      // Ignore cleanup error
    }

    const errMessage = error instanceof Error ? error.message : 'Unknown encoding error';
    onProgress({
      stage: 'error',
      currentFrame: 0,
      totalFrames,
      percentage: 0,
      fpsRate: 0,
      elapsedSeconds: 0,
      remainingSeconds: 0,
      statusMessage: `Conversion failed: ${errMessage}`,
      error: errMessage,
    });
    throw error;
  } finally {
    // Explicitly release canvas reference
    canvas.width = 0;
    canvas.height = 0;
  }
}
