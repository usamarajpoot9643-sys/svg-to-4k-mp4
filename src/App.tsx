import React, { useState, useMemo, useRef } from 'react';
import { 
  Play, 
  Film, 
  Sparkles, 
  Cpu, 
  Layers
} from 'lucide-react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { SvgPreview } from './components/SvgPreview';
import { RenderConfig } from './components/RenderConfig';
import { ProgressModal } from './components/ProgressModal';
import { VideoPlayer } from './components/VideoPlayer';
import { ErrorAlert } from './components/ErrorAlert';
import { SVG_PRESETS } from './services/presets';
import { analyzeSvg } from './services/svgParser';
import { convertSvgToMp4 } from './services/mp4Encoder';
import type { 
  VideoSettings, 
  ConversionProgress, 
  ExportResult 
} from './types/config';
import type { SvgPreset } from './types/svg';
import { RESOLUTION_PRESETS } from './types/config';
import { formatBytes, formatBitrate } from './utils/formatters';

export const App: React.FC = () => {
  // Initial default: Cyberpunk Neon Hexagon preset
  const defaultPreset = SVG_PRESETS[0];
  const [svgCode, setSvgCode] = useState<string>(defaultPreset.svgCode);

  // Video render settings
  const [settings, setSettings] = useState<VideoSettings>({
    resolutionPreset: '4k',
    customWidth: RESOLUTION_PRESETS['4k'].width,
    customHeight: RESOLUTION_PRESETS['4k'].height,
    fps: 60,
    duration: defaultPreset.recommendedDuration,
    bitrate: RESOLUTION_PRESETS['4k'].recommendedBitrate,
    background: {
      type: 'solid',
      color: '#050510',
      gradient: {
        type: 'linear',
        angle: 135,
        startColor: '#090a0f',
        endColor: '#181e36',
      },
    },
    renderMode: 'frame-stepping',
  });

  // Conversion Progress State
  const [progress, setProgress] = useState<ConversionProgress>({
    stage: 'idle',
    currentFrame: 0,
    totalFrames: 0,
    percentage: 0,
    fpsRate: 0,
    elapsedSeconds: 0,
    remainingSeconds: 0,
    statusMessage: '',
  });

  // Completed Export Result
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Abort controller for cancelling conversion
  const abortControllerRef = useRef<AbortController | null>(null);

  // Analyze SVG metadata in real time
  const metadata = useMemo(() => {
    return analyzeSvg(svgCode);
  }, [svgCode]);

  // Handle Preset selection
  const handleSelectPreset = (preset: SvgPreset) => {
    setSvgCode(preset.svgCode);
    setSettings((prev) => ({
      ...prev,
      duration: preset.recommendedDuration,
      fps: preset.recommendedFps,
    }));
    setExportResult(null);
  };

  // Cancel conversion handler
  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setProgress((prev) => ({
      ...prev,
      stage: 'cancelled',
      statusMessage: 'Render cancelled by user.',
    }));
  };

  // Convert SVG to MP4 handler
  const handleStartConversion = async () => {
    if (!metadata.isValid) {
      setErrorMessage(metadata.error || 'Please provide a valid SVG document.');
      return;
    }

    if (metadata.hasForeignObject) {
      setErrorMessage(
        'Unsupported element: Your SVG contains <foreignObject> (HTML inside SVG). Browsers block reading canvas pixels from <foreignObject> for security reasons (canvas taint), which causes WebCodecs video encoding to fail. Please replace <foreignObject> HTML with standard SVG vector elements (<text>, <tspan>, or <path>).'
      );
      return;
    }

    setErrorMessage(null);
    setExportResult(null);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const result = await convertSvgToMp4({
        svgCode,
        settings,
        isAnimated: metadata.isAnimated,
        onProgress: setProgress,
        signal: abortController.signal,
      });

      setExportResult(result);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // User aborted, handled cleanly
        return;
      }
      const message = err instanceof Error ? err.message : 'Video encoding failed.';
      setErrorMessage(message);
    } finally {
      abortControllerRef.current = null;
    }
  };

  // Estimated file size calculation
  const estimatedSizeBytes = useMemo(() => {
    return Math.round((settings.bitrate * settings.duration) / 8);
  }, [settings.bitrate, settings.duration]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-indigo-600/30 selection:text-white">
      {/* Top Navbar */}
      <Header />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error Banners */}
        {errorMessage && (
          <ErrorAlert
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
          />
        )}

        {/* Export Result View (when available) */}
        {exportResult && (
          <VideoPlayer
            result={exportResult}
            onReset={() => setExportResult(null)}
          />
        )}

        {/* Core Workspace Grid: Editor & Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Code Editor & Upload */}
          <div className="flex flex-col space-y-2">
            <CodeEditor
              value={svgCode}
              onChange={(val) => {
                setSvgCode(val);
                setExportResult(null);
              }}
              metadata={metadata}
              onSelectPreset={handleSelectPreset}
            />
          </div>

          {/* Right Column: Live Interactive Preview */}
          <div className="flex flex-col space-y-2">
            <SvgPreview
              svgCode={svgCode}
              metadata={metadata}
              background={settings.background}
            />
          </div>
        </div>

        {/* Video Configuration Panel */}
        <RenderConfig
          settings={settings}
          onChange={setSettings}
          suggestedDuration={metadata.suggestedDuration}
          isAnimated={metadata.isAnimated}
        />

        {/* Conversion Action Bar */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-extrabold text-zinc-100">
                  {settings.customWidth} × {settings.customHeight} @ {settings.fps} FPS
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {settings.duration}s ({Math.round(settings.duration * settings.fps)} frames)
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 flex items-center space-x-2">
                <span>Estimated Size: ~{formatBytes(estimatedSizeBytes)}</span>
                <span>•</span>
                <span>Target: {formatBitrate(settings.bitrate)}</span>
                <span>•</span>
                <span>{metadata.isAnimated ? 'Animated Vector' : 'Static Loop'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleStartConversion}
              disabled={!metadata.isValid || progress.stage === 'rasterizing' || progress.stage === 'encoding'}
              className="flex items-center space-x-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-extrabold text-sm shadow-xl shadow-purple-500/25 transition-all transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Synthesize 4K MP4 Video</span>
            </button>
          </div>
        </div>

        {/* Technical Architecture Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-zinc-200">Hardware WebCodecs Acceleration</h5>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                Encodes frames using native GPU hardware encoders (NVENC, QuickSync, Apple VT) with zero server latency.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-zinc-200">Zero-Leak Buffer Disposal</h5>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                4K frames (33MB each) are immediately disposed via <code className="text-purple-300 font-mono text-[10px]">VideoFrame.close()</code> to ensure rock-solid browser stability.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-zinc-200">Dual SMIL & CSS Time Stepping</h5>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                Frame-by-frame negative delay injection guarantees zero dropped frames and jitter-free 60 FPS motion rendering.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Progress & Telemetry Modal */}
      <ProgressModal
        progress={progress}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default App;
