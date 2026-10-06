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
    <div className="min-h-screen bg-[#050508] text-zinc-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-100 relative overflow-x-hidden">
      {/* Ambient luxury lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08),transparent_70%)] pointer-events-none -z-0" />

      {/* Top Navbar */}
      <Header />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative z-10">
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
        <div className="relative bg-[#08080e]/95 backdrop-blur-md border border-amber-500/20 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-2xl shadow-black/80 overflow-hidden">
          {/* Subtle gold decorative shimmer */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center space-x-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 via-yellow-500/10 to-transparent border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/10 shrink-0">
              <Film className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-amber-100 tracking-wide font-cinzel">
                  {settings.customWidth} × {settings.customHeight} @ {settings.fps} FPS
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {settings.duration}s ({Math.round(settings.duration * settings.fps)} frames)
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[11px]">
                <span className="text-zinc-300">Est. Size: ~{formatBytes(estimatedSizeBytes)}</span>
                <span className="text-amber-500/40">•</span>
                <span className="text-zinc-300">Target: {formatBitrate(settings.bitrate)}</span>
                <span className="text-amber-500/40">•</span>
                <span className="text-amber-400/80">{metadata.isAnimated ? 'Animated Vector' : 'Static Loop'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 relative z-10">
            <button
              onClick={handleStartConversion}
              disabled={!metadata.isValid || progress.stage === 'rasterizing' || progress.stage === 'encoding'}
              className="flex items-center space-x-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:via-yellow-200 hover:to-amber-400 text-zinc-950 font-black text-xs tracking-wider shadow-xl shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer uppercase"
            >
              <Play className="w-4 h-4 fill-zinc-950 text-zinc-950" />
              <span>Synthesize 4K MP4 Video</span>
            </button>
          </div>
        </div>

        {/* Technical Architecture Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#08080e]/80 border border-amber-500/15 hover:border-amber-500/30 transition-colors flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/25 shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-amber-100 font-cinzel tracking-wide">Hardware WebCodecs Acceleration</h5>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                Encodes frames using native GPU hardware encoders (NVENC, QuickSync, Apple VT) with zero server latency.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#08080e]/80 border border-amber-500/15 hover:border-amber-500/30 transition-colors flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/25 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-amber-100 font-cinzel tracking-wide">Zero-Leak Buffer Disposal</h5>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                4K frames (33MB each) are immediately disposed via <code className="text-amber-300 font-mono text-[10px]">VideoFrame.close()</code> to ensure rock-solid browser stability.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#08080e]/80 border border-amber-500/15 hover:border-amber-500/30 transition-colors flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/25 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-amber-100 font-cinzel tracking-wide">Dual SMIL & CSS Time Stepping</h5>
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
