import React from 'react';
import { Film, Cpu, ShieldCheck, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-zinc-100 tracking-tight">SVG</span>
              <span className="text-zinc-500 text-sm font-medium">➔</span>
              <span className="font-extrabold text-lg bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                4K MP4 Studio
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-full">
                UHD 60FPS
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Client-Side WebCodecs Hardware Accelerated Video Synthesizer
            </p>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-medium">WebCodecs H.264</span>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium">100% Client-Side</span>
          </div>

          <div className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-xs">Zero Server Limits</span>
          </div>
        </div>
      </div>
    </header>
  );
};
