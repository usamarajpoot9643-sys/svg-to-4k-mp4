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
  { name: 'Pure Obsidian', color: '#000000' },
  { name: 'Royal Onyx', color: '#07070b' },
  { name: 'Champagne Noir', color: '#0f0c08' },
  { name: 'Velvet Burgundy', color: '#18050e' },
  { name: 'Studio Platinum', color: '#ffffff' },
  { name: 'Emerald Vault', color: '#021814' },
];

const GRADIENT_PRESETS = [
  { name: 'Imperial Gold', start: '#120d04', end: '#2d2109', angle: 45 },
  { name: 'Champagne Noir', start: '#08080c', end: '#1a160d', angle: 135 },
  { name: 'Midnight Glow', start: '#090a0f', end: '#181e36', angle: 135 },
  { name: 'Cosmic Violet', start: '#110026', end: '#2d004d', angle: 160 },
  { name: 'Solar Amber', start: '#1f0800', end: '#4a1e00', angle: 90 },
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
      onChange({ ...settings, customWidth: w, customHeight: validH });
    } else {
      onChange({ ...settings, customHeight: validH });
    }
  };

  return (
    <div className="bg-[#08080e] border border-amber-500/20 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/60 hover:border-amber-500/35 transition-all duration-300 space-y-6">
      <div className="flex items-center justify-between border-b border-amber-500/15 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/25">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-cinzel font-bold text-zinc-100 tracking-wide">Studio Render & Video Configuration</h3>
            <p className="text-xs text-zinc-400">Target 4K resolution, framerate, timeline & canvas backdrop</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px] font-mono font-semibold tracking-wider uppercase shadow-xs">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Lossless 4K Scaling</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Resolution & Framerate */}
        <div className="space-y-5">
          {/* Resolution Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5">
                <Tv className="w-3.5 h-3.5 text-amber-400" />
                <span>Target Resolution</span>
              </label>
              <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg">
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
                    className={`relative flex flex-col p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/10 ring-1 ring-amber-400 text-amber-200 shadow-sm shadow-amber-500/10'
                        : 'border-zinc-800/80 bg-[#0b0b12] hover:bg-[#10101a] hover:border-amber-500/30 text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-100 uppercase tracking-wide">
                        {preset === 'custom' ? 'Custom' : RESOLUTION_PRESETS[preset].id}
                      </span>
                      {is4K && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 shadow-xs">
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
              <div className="mt-3 p-3 bg-zinc-900/90 border border-amber-500/20 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>Custom Dimensions (px)</span>
                  <button
                    type="button"
                    onClick={() => setAspectLocked(!aspectLocked)}
                    className="flex items-center space-x-1 text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer"
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
                      className="w-full bg-zinc-950 border border-zinc-700/60 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 font-mono focus:ring-1 focus:ring-amber-500"
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
                      className="w-full bg-zinc-950 border border-zinc-700/60 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 font-mono focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Frame Rate (FPS) */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5 mb-2">
              <Gauge className="w-3.5 h-3.5 text-amber-400" />
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
                        ? 'border-amber-400 bg-amber-500/10 ring-1 ring-amber-400 text-amber-300 shadow-sm shadow-amber-500/10'
                        : 'border-zinc-800/80 bg-[#0b0b12] hover:bg-[#10101a] hover:border-amber-500/30 text-zinc-400'
                    }`}
                  >
                    <span className="text-xs font-bold">{fps} FPS</span>
                    <span className="text-[10px] text-zinc-400">
                      {fps === 60 ? 'Ultra Fluid 60fps' : 'Standard 30fps'}
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
              <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg">
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
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    settings.bitrate === opt.val
                      ? 'border-amber-400 bg-amber-500/15 text-amber-200 font-bold shadow-xs'
                      : 'border-zinc-800/80 bg-[#0b0b12] text-zinc-400 hover:bg-[#10101a] hover:border-amber-500/30'
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
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Duration ({formatDuration(settings.duration)})</span>
              </label>
              <div className="flex items-center space-x-1">
                {suggestedDuration && isAnimated && (
                  <button
                    type="button"
                    onClick={() => onChange({ ...settings, duration: suggestedDuration })}
                    className="text-[10px] bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 px-2.5 py-0.5 rounded-lg border border-amber-500/30 font-medium cursor-pointer transition-colors"
                    title="Matched loop duration from SVG animation keyframes"
                  >
                    Auto-Fit Loop ({suggestedDuration}s)
                  </button>
                )}
                <span className="text-[11px] font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-lg">
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
              className="w-full accent-amber-400 h-1.5 bg-zinc-900 rounded-lg cursor-pointer"
            />

            {/* Quick chips */}
            <div className="flex items-center justify-between mt-2.5 gap-1.5">
              {[2, 3, 5, 8, 10, 15, 30].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => onChange({ ...settings, duration: sec })}
                  className={`flex-1 py-1 text-[11px] rounded-lg border text-center transition-all cursor-pointer ${
                    settings.duration === sec
                      ? 'border-amber-400 bg-amber-500/20 text-amber-200 font-bold shadow-xs'
                      : 'border-zinc-800/80 bg-[#0b0b12] text-zinc-400 hover:bg-[#10101a] hover:border-amber-500/30'
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
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Canvas Background</span>
            </label>

            {/* Background Type Tabs */}
            <div className="grid grid-cols-3 gap-1.5 bg-[#0b0b12] p-1 rounded-xl border border-amber-500/20 text-xs mb-3">
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
                  className={`py-1.5 rounded-lg capitalize font-medium transition-all cursor-pointer ${
                    settings.background.type === type
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold shadow-xs'
                      : 'text-zinc-400 hover:text-amber-200'
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
                    className="w-9 h-9 rounded-xl bg-zinc-900 border border-amber-500/30 cursor-pointer p-0.5"
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
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs font-mono text-zinc-200 uppercase focus:ring-1 focus:ring-amber-400"
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
                      className={`h-7 rounded-xl border transition-all cursor-pointer ${
                        settings.background.color.toLowerCase() === swatch.color.toLowerCase()
                          ? 'border-amber-400 scale-105 shadow-md shadow-amber-500/30'
                          : 'border-zinc-700/60 hover:scale-105 hover:border-amber-500/40'
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
                      className="w-8 h-8 rounded-lg bg-zinc-900 border border-amber-500/30 cursor-pointer p-0.5"
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
                      className="w-8 h-8 rounded-lg bg-zinc-900 border border-amber-500/30 cursor-pointer p-0.5"
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
                    <span className="font-mono text-amber-300">{settings.background.gradient.angle}°</span>
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
                    className="w-full accent-amber-400 h-1.5 bg-zinc-900 rounded-lg cursor-pointer"
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
                      className="h-7 rounded-xl border border-zinc-700/60 hover:scale-105 hover:border-amber-400 transition-all cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Transparent Info */}
            {settings.background.type === 'transparent' && (
              <div className="p-3.5 bg-zinc-900/80 border border-amber-500/20 rounded-xl text-xs text-zinc-400 space-y-1">
                <p className="font-medium text-amber-300 flex items-center space-x-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-400" />
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

export default RenderConfig;
