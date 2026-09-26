import React from 'react';
import { 
  Settings, 
  Tv, 
  Gauge, 
  Clock, 
  Palette, 
  Flame, 
  Sparkles, 
  Info, 
  Lock, 
  Unlock 
} from 'lucide-react';
import type { 
  VideoSettings, 
  ResolutionPreset, 
  FPSOption, 
  BackgroundType 
} from '../types/config';
import { RESOLUTION_PRESETS } from '../types/config';
import { formatBitrate, formatDuration } from '../utils/formatters';

interface RenderConfigProps {
  settings: VideoSettings;
  onChange: (settings: VideoSettings) => void;
  suggestedDuration?: number;
  isAnimated: boolean;
}

const SOLID_PRESETS = [
  { name: 'Pure Black', color: '#000000' },
  { name: 'Slate 950', color: '#020617' },
  { name: 'Studio White', color: '#ffffff' },
  { name: 'Dark Indigo', color: '#090d16' },
  { name: 'Cyber Violet', color: '#130826' },
  { name: 'Emerald Night', color: '#021814' },
];

const GRADIENT_PRESETS = [
  { name: 'Midnight Glow', start: '#090a0f', end: '#181e36', angle: 135 },
  { name: 'Cyberpunk Neon', start: '#0d0221', end: '#261447', angle: 45 },
  { name: 'Cosmic Violet', start: '#110026', end: '#2d004d', angle: 160 },
  { name: 'Solar Flare', start: '#1f0000', end: '#4a0e00', angle: 90 },
  { name: 'Deep Space', start: '#000428', end: '#004e92', angle: 180 },
];

export const RenderConfig: React.FC<RenderConfigProps> = ({
  settings,
  onChange,
  suggestedDuration,
  isAnimated,
}) => {
  const [aspectLocked, setAspectLocked] = React.useState(true);

  // Resolution preset handler
  const handleResolutionPreset = (preset: ResolutionPreset) => {
    if (preset === 'custom') {
      onChange({ ...settings, resolutionPreset: 'custom' });
    } else {
      const conf = RESOLUTION_PRESETS[preset];
      onChange({
        ...settings,
        resolutionPreset: preset,
        customWidth: conf.width,
        customHeight: conf.height,
        bitrate: conf.recommendedBitrate,
      });
    }
  };

  // Custom dimension handlers
  const handleCustomWidth = (w: number) => {
    const validW = Math.max(128, Math.min(w, 7680));
    if (aspectLocked) {
      const h = Math.round((validW * 9) / 16);
      onChange({ ...settings, customWidth: validW, customHeight: h });
    } else {
      onChange({ ...settings, customWidth: validW });
    }
  };

  const handleCustomHeight = (h: number) => {
    const validH = Math.max(128, Math.min(h, 4320));
    if (aspectLocked) {
      const w = Math.round((validH * 16) / 9);
      onChange({ ...settings, customHeight: validH, customWidth: w });
    } else {
      onChange({ ...settings, customHeight: validH });
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100">Render & Video Configuration</h3>
            <p className="text-xs text-zinc-400">Target 4K resolution, frame rate, timeline & canvas backdrop</p>
          </div>
        </div>

        <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
          <Sparkles className="w-3 h-3" />
          <span>Lossless Vector Scaling</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Resolution & Framerate */}
        <div className="space-y-5">
          {/* Resolution Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5">
                <Tv className="w-3.5 h-3.5 text-indigo-400" />
                <span>Target Resolution</span>
              </label>
              <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                {settings.customWidth} × {settings.customHeight}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {(['4k', '1440p', '1080p', 'custom'] as const).map((preset) => {
                const isSelected = settings.resolutionPreset === preset;
                const is4K = preset === '4k';
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleResolutionPreset(preset)}
                    className={`relative flex flex-col p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500'
                        : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-100 uppercase">
                        {preset === 'custom' ? 'Custom' : RESOLUTION_PRESETS[preset].id}
                      </span>
                      {is4K && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-xs">
                          TRUE 4K
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-400 mt-1">
                      {preset === 'custom'
                        ? 'User Defined'
                        : `${RESOLUTION_PRESETS[preset].width} × ${RESOLUTION_PRESETS[preset].height}`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Dimensions Input if selected */}
            {settings.resolutionPreset === 'custom' && (
              <div className="mt-3 p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>Custom Dimensions (px)</span>
                  <button
                    type="button"
                    onClick={() => setAspectLocked(!aspectLocked)}
                    className="flex items-center space-x-1 text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer"
                  >
                    {aspectLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    <span>{aspectLocked ? '16:9 Locked' : 'Unlocked'}</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-zinc-500 block mb-0.5">Width (even)</label>
                    <input
                      type="number"
                      step={2}
                      min={128}
                      max={7680}
                      value={settings.customWidth}
                      onChange={(e) => handleCustomWidth(parseInt(e.target.value) || 1920)}
                      className="w-full bg-zinc-950 border border-zinc-700/60 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 font-mono focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 block mb-0.5">Height (even)</label>
                    <input
                      type="number"
                      step={2}
                      min={128}
                      max={4320}
                      value={settings.customHeight}
                      onChange={(e) => handleCustomHeight(parseInt(e.target.value) || 1080)}
                      className="w-full bg-zinc-950 border border-zinc-700/60 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 font-mono focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Frame Rate (FPS) */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5 mb-2">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              <span>Frame Rate (FPS)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {([30, 60] as FPSOption[]).map((fps) => {
                const isSelected = settings.fps === fps;
                return (
                  <button
                    key={fps}
                    type="button"
                    onClick={() => onChange({ ...settings, fps })}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500 text-emerald-300'
                        : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-400'
                    }`}
                  >
                    <span className="text-xs font-bold">{fps} FPS</span>
                    <span className="text-[10px] text-zinc-400">
                      {fps === 60 ? 'Ultra Fluid' : 'Standard Broadcast'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bitrate Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Video Bitrate Target</span>
              </label>
              <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                {formatBitrate(settings.bitrate)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { label: 'Eco (12M)', val: 12_000_000 },
                { label: 'Balanced (25M)', val: 25_000_000 },
                { label: 'Pro 4K (40M)', val: 40_000_000 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => onChange({ ...settings, bitrate: opt.val })}
                  className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                    settings.bitrate === opt.val
                      ? 'border-amber-500 bg-amber-500/10 text-amber-300 font-semibold'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Duration & Background */}
        <div className="space-y-5">
          {/* Duration Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>Duration ({formatDuration(settings.duration)})</span>
              </label>
              <div className="flex items-center space-x-1">
                {suggestedDuration && isAnimated && (
                  <button
                    type="button"
                    onClick={() => onChange({ ...settings, duration: suggestedDuration })}
                    className="text-[10px] bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 px-2 py-0.5 rounded border border-purple-500/30 font-medium cursor-pointer"
                    title="Matched loop duration from SVG animation keyframes"
                  >
                    Auto-Fit Loop ({suggestedDuration}s)
                  </button>
                )}
                <span className="text-[11px] font-mono text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded">
                  {Math.round(settings.duration * settings.fps)} frames
                </span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={1}
              max={60}
              step={1}
              value={settings.duration}
              onChange={(e) => onChange({ ...settings, duration: parseInt(e.target.value) || 5 })}
              className="w-full accent-purple-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />

            {/* Quick chips */}
            <div className="flex items-center justify-between mt-2 gap-1.5">
              {[2, 3, 5, 8, 10, 15, 30].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => onChange({ ...settings, duration: sec })}
                  className={`flex-1 py-1 text-[11px] rounded-md border text-center transition-colors cursor-pointer ${
                    settings.duration === sec
                      ? 'border-purple-500 bg-purple-500/20 text-purple-200 font-bold'
                      : 'border-zinc-800/80 bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>

            {!isAnimated && (
              <p className="text-[11px] text-zinc-500 mt-2 flex items-center space-x-1">
                <Info className="w-3 h-3 text-zinc-400" />
                <span>Static SVG: Exports a fixed {settings.duration}s 4K video loop instantly.</span>
              </p>
            )}
          </div>

          {/* Background Configuration */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5 mb-2">
              <Palette className="w-3.5 h-3.5 text-pink-400" />
              <span>Canvas Background</span>
            </label>

            {/* Background Type Tabs */}
            <div className="grid grid-cols-3 gap-1.5 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 text-xs mb-3">
              {(['solid', 'gradient', 'transparent'] as BackgroundType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...settings,
                      background: { ...settings.background, type },
                    })
                  }
                  className={`py-1.5 rounded-lg capitalize font-medium transition-colors cursor-pointer ${
                    settings.background.type === type
                      ? 'bg-zinc-800 text-white shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Solid Color Options */}
            {settings.background.type === 'solid' && (
              <div className="space-y-2.5">
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={settings.background.color}
                    onChange={(e) =>
                      onChange({
                        ...settings,
                        background: { ...settings.background, color: e.target.value },
                      })
                    }
                    className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-700 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={settings.background.color}
                    onChange={(e) =>
                      onChange({
                        ...settings,
                        background: { ...settings.background, color: e.target.value },
                      })
                    }
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-200 uppercase focus:ring-1 focus:ring-indigo-500"
                    placeholder="#000000"
                  />
                </div>

                {/* Swatches */}
                <div className="grid grid-cols-6 gap-1.5">
                  {SOLID_PRESETS.map((swatch) => (
                    <button
                      key={swatch.color}
                      type="button"
                      onClick={() =>
                        onChange({
                          ...settings,
                          background: { ...settings.background, color: swatch.color },
                        })
                      }
                      title={swatch.name}
                      style={{ backgroundColor: swatch.color }}
                      className={`h-7 rounded-lg border transition-transform cursor-pointer ${
                        settings.background.color.toLowerCase() === swatch.color.toLowerCase()
                          ? 'border-indigo-400 scale-105 shadow-md shadow-indigo-500/20'
                          : 'border-zinc-700/60 hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Gradient Options */}
            {settings.background.type === 'gradient' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={settings.background.gradient.startColor}
                      onChange={(e) =>
                        onChange({
                          ...settings,
                          background: {
                            ...settings.background,
                            gradient: { ...settings.background.gradient, startColor: e.target.value },
                          },
                        })
                      }
                      className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 cursor-pointer p-0.5"
                    />
                    <span className="text-[11px] font-mono text-zinc-400 uppercase">
                      {settings.background.gradient.startColor}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={settings.background.gradient.endColor}
                      onChange={(e) =>
                        onChange({
                          ...settings,
                          background: {
                            ...settings.background,
                            gradient: { ...settings.background.gradient, endColor: e.target.value },
                          },
                        })
                      }
                      className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 cursor-pointer p-0.5"
                    />
                    <span className="text-[11px] font-mono text-zinc-400 uppercase">
                      {settings.background.gradient.endColor}
                    </span>
                  </div>
                </div>

                {/* Angle slider */}
                <div>
                  <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                    <span>Gradient Angle</span>
                    <span className="font-mono">{settings.background.gradient.angle}°</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    step={15}
                    value={settings.background.gradient.angle}
                    onChange={(e) =>
                      onChange({
                        ...settings,
                        background: {
                          ...settings.background,
                          gradient: {
                            ...settings.background.gradient,
                            angle: parseInt(e.target.value) || 0,
                          },
                        },
                      })
                    }
                    className="w-full accent-indigo-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Gradient presets */}
                <div className="grid grid-cols-5 gap-1.5">
                  {GRADIENT_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() =>
                        onChange({
                          ...settings,
                          background: {
                            ...settings.background,
                            gradient: {
                              type: 'linear',
                              startColor: p.start,
                              endColor: p.end,
                              angle: p.angle,
                            },
                          },
                        })
                      }
                      title={p.name}
                      style={{
                        backgroundImage: `linear-gradient(${p.angle}deg, ${p.start}, ${p.end})`,
                      }}
                      className="h-7 rounded-lg border border-zinc-700/60 hover:scale-105 transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Transparent Info */}
            {settings.background.type === 'transparent' && (
              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-400 space-y-1">
                <p className="font-medium text-zinc-200 flex items-center space-x-1">
                  <Info className="w-3.5 h-3.5 text-indigo-400" />
                  <span>MP4 Video Alpha Notice</span>
                </p>
                <p className="text-[11px] leading-relaxed text-zinc-400">
                  Standard H.264/MP4 specifications do not include an alpha channel. Transparent SVG areas will be encoded against a clean black baseline for maximum player compatibility.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
