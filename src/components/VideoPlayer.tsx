import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Maximize, 
  HardDrive, 
  Tv, 
  Gauge, 
  Flame, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import type { ExportResult } from '../types/config';
import { formatBytes, formatBitrate, formatTime } from '../utils/formatters';

interface VideoPlayerProps {
  result: ExportResult;
  onReset: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ result, onReset }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(result.duration);
  const [isLooping, setIsLooping] = useState(true);

  // Sync video timeline
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
    };
    const handleEnded = () => {
      if (!isLooping) setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isLooping]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const target = parseFloat(e.target.value);
    video.currentTime = target;
    setCurrentTime(target);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  // Download trigger
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Calculate actual effective bitrate from file size and duration
  const effectiveBitrate = Math.round((result.fileSizeBytes * 8) / (result.duration || 1));

  return (
    <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl p-5 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-zinc-100">4K MP4 Render Ready</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                100% SUCCESS
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Hardware accelerated ISO BMFF H.264 video encoded in-browser
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onReset}
            className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 text-xs font-semibold transition-colors cursor-pointer"
          >
            Render Another
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all transform active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download MP4</span>
          </button>
        </div>
      </div>

      {/* Video Preview Canvas */}
      <div className="relative rounded-2xl overflow-hidden bg-black border border-zinc-800 group shadow-inner">
        <video
          ref={videoRef}
          src={result.url}
          autoPlay
          loop={isLooping}
          muted
          playsInline
          className="w-full max-h-[460px] object-contain mx-auto cursor-pointer"
          onClick={togglePlay}
        />

        {/* Video Overlaid Controls */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex flex-col space-y-2 opacity-90 group-hover:opacity-100 transition-opacity">
          {/* Progress scrubber */}
          <input
            type="range"
            min={0}
            max={duration || result.duration}
            step={0.01}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-zinc-700/60 rounded-lg cursor-pointer accent-indigo-500"
          />

          <div className="flex items-center justify-between text-xs text-zinc-300">
            <div className="flex items-center space-x-3">
              <button
                onClick={togglePlay}
                className="p-1 text-white hover:text-indigo-400 transition-colors cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                  isLooping
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                    : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/40'
                }`}
                title="Toggle loop playback"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Loop</span>
              </button>

              <span className="font-mono text-[11px] text-zinc-400">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-mono text-[11px] bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800 text-zinc-300">
                {result.width} × {result.height} @ {result.fps} FPS
              </span>
              <button
                onClick={toggleFullscreen}
                className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Statistics Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-3 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
              File Size
            </span>
            <span className="text-sm font-bold font-mono text-zinc-100">
              {formatBytes(result.fileSizeBytes)}
            </span>
          </div>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-3 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Tv className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
              Resolution
            </span>
            <span className="text-sm font-bold font-mono text-zinc-100">
              {result.width >= 3840 ? '4K UHD' : `${result.width}×${result.height}`}
            </span>
          </div>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-3 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
              FPS & Codec
            </span>
            <span className="text-sm font-bold font-mono text-zinc-100">
              {result.fps} FPS H.264
            </span>
          </div>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-3 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
              Bitrate
            </span>
            <span className="text-sm font-bold font-mono text-zinc-100">
              {formatBitrate(effectiveBitrate)}
            </span>
          </div>
        </div>
      </div>

      {/* Direct Download Callout */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/40 to-pink-950/40 border border-indigo-500/20 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
          <p className="text-xs text-zinc-300">
            Generated file: <code className="text-indigo-300 font-mono text-[11px] bg-black/40 px-2 py-0.5 rounded">{result.filename}</code>
          </p>
        </div>

        <button
          onClick={handleDownload}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Download className="w-4 h-4 text-zinc-950" />
          <span>Save Video</span>
        </button>
      </div>
    </div>
  );
};
