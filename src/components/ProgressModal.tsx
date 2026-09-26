import React from 'react';
import { 
  Loader2, 
  XCircle, 
  Cpu, 
  Layers, 
  Gauge, 
  Clock,
  Eye
} from 'lucide-react';
import type { ConversionProgress } from '../types/config';
import { formatTime } from '../utils/formatters';

interface ProgressModalProps {
  progress: ConversionProgress;
  onCancel: () => void;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
  progress,
  onCancel,
}) => {
  const {
    stage,
    currentFrame,
    totalFrames,
    percentage,
    fpsRate,
    elapsedSeconds,
    remainingSeconds,
    statusMessage,
  } = progress;

  if (stage === 'idle' || stage === 'done' || stage === 'cancelled') {
    return null;
  }

  // Stages definition
  const stages = [
    { id: 'parsing', label: 'Vector Normalization' },
    { id: 'rasterizing', label: '4K Rasterization' },
    { id: 'encoding', label: 'WebCodecs H.264' },
    { id: 'finalizing', label: 'MP4 Multiplexing' },
  ];

  const getStageStatus = (stageId: string) => {
    if (stage === 'error') return 'error';
    if (stage === stageId) return 'active';

    const order = ['parsing', 'rasterizing', 'encoding', 'finalizing'];
    const currentIndex = order.indexOf(stage);
    const targetIndex = order.indexOf(stageId);

    if (currentIndex > targetIndex) return 'completed';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-purple-950/40 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">Converting SVG to 4K MP4</h3>
              <p className="text-xs text-zinc-400">Live Frame Rasterization & WebCodecs Encoding</p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
            title="Cancel conversion"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Live 4K Canvas Frame Monitor */}
        <div className="relative rounded-2xl overflow-hidden bg-black border border-zinc-800/90 aspect-video flex items-center justify-center shadow-inner">
          <canvas
            id="live-recording-preview-canvas"
            width={640}
            height={360}
            className="w-full h-full object-contain"
          />
          <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/75 border border-white/10 text-[10px] font-semibold text-emerald-400">
            <Eye className="w-3 h-3 animate-pulse" />
            <span>LIVE 4K CANVAS BUFFER FEED</span>
          </div>
          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/75 border border-white/10 font-mono text-[10px] text-zinc-300">
            Frame #{currentFrame}
          </div>
        </div>

        {/* Multi-stage workflow indicator */}
        <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
          {stages.map((st) => {
            const status = getStageStatus(st.id);
            return (
              <div key={st.id} className="flex flex-col items-center space-y-1.5">
                <div
                  className={`w-full h-1.5 rounded-full transition-all duration-300 ${
                    status === 'completed'
                      ? 'bg-emerald-500'
                      : status === 'active'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse'
                      : 'bg-zinc-800'
                  }`}
                />
                <span
                  className={`font-semibold ${
                    status === 'active'
                      ? 'text-indigo-300'
                      : status === 'completed'
                      ? 'text-emerald-400'
                      : 'text-zinc-500'
                  }`}
                >
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-medium text-zinc-300 truncate max-w-xs">
              {statusMessage}
            </span>
            <span className="text-2xl font-black font-mono bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {percentage}%
            </span>
          </div>

          <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-150 ease-out shadow-lg shadow-purple-500/50"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800/80 text-xs">
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-zinc-900/80 border border-zinc-800/50">
            <div className="flex items-center space-x-1 text-zinc-400 text-[10px] mb-0.5">
              <Layers className="w-3 h-3 text-indigo-400" />
              <span>Frames</span>
            </div>
            <span className="font-mono font-bold text-zinc-200">
              {currentFrame} / {totalFrames}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-zinc-900/80 border border-zinc-800/50">
            <div className="flex items-center space-x-1 text-zinc-400 text-[10px] mb-0.5">
              <Gauge className="w-3 h-3 text-emerald-400" />
              <span>Speed</span>
            </div>
            <span className="font-mono font-bold text-emerald-400">
              {fpsRate > 0 ? `${fpsRate} fps` : '--'}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-zinc-900/80 border border-zinc-800/50">
            <div className="flex items-center space-x-1 text-zinc-400 text-[10px] mb-0.5">
              <Clock className="w-3 h-3 text-purple-400" />
              <span>Remaining</span>
            </div>
            <span className="font-mono font-bold text-zinc-200">
              {remainingSeconds > 0 ? `${formatTime(remainingSeconds)}` : 'Wrapping up...'}
            </span>
          </div>
        </div>

        {/* Memory Management Notice */}
        <div className="flex items-center justify-between text-[11px] text-zinc-500 px-1">
          <div className="flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-zinc-400" />
            <span>Active Frame Buffer Recycling (Zero Memory Leak)</span>
          </div>
          <span className="font-mono">Elapsed: {formatTime(elapsedSeconds)}</span>
        </div>

        {/* Footer cancel action */}
        <div className="pt-1 flex justify-end">
          <button
            onClick={onCancel}
            className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold border border-zinc-800 transition-colors cursor-pointer"
          >
            Cancel Video Render
          </button>
        </div>
      </div>
    </div>
  );
};
