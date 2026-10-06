import React from 'react';
import { Film, Cpu, ShieldCheck, Sparkles, Crown } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-amber-500/15 bg-[#050508]/85 backdrop-blur-xl sticky top-0 z-40 shadow-xl shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Monogram */}
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-300/40 transform hover:scale-105 transition-transform duration-300">
              <Film className="w-5 h-5 text-zinc-950 stroke-[2.2]" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-zinc-950 border border-amber-400/60 flex items-center justify-center">
              <Crown className="w-2.5 h-2.5 text-amber-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2.5">
              <span className="font-cinzel font-black text-xl text-zinc-100 tracking-wider">SVG</span>
              <span className="text-amber-400/80 text-sm font-light">➔</span>
              <span className="font-cinzel font-black text-xl gold-gradient-text tracking-wide drop-shadow-sm">
                4K MP4 STUDIO
              </span>
              <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-widest uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>UHD 60FPS</span>
              </span>
            </div>
            <p className="text-[11px] font-mono tracking-wider text-amber-400/70 uppercase hidden sm:block">
              HAUTE PERFORMANCE • PRIVATE CLIENT-SIDE SYNTHESIZER
            </p>
          </div>
        </div>

        {/* Luxury Feature Badges */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
          <div className="hidden lg:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-950/80 border border-amber-500/20 text-zinc-300 shadow-sm hover:border-amber-400/40 transition-colors">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-[11px] font-medium tracking-wide">WebCodecs GPU</span>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-950/80 border border-amber-500/20 text-zinc-300 shadow-sm hover:border-amber-400/40 transition-colors">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-[11px] font-medium tracking-wide">100% In-Browser</span>
          </div>

          <div className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/35 text-amber-200 shadow-md shadow-amber-500/5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-[11px] font-bold tracking-wider uppercase">Zero Server Uploads</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
