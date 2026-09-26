import React, { useState, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Eye, 
  AlertTriangle,
  Move
} from 'lucide-react';
import type { BackgroundConfig } from '../types/config';
import type { SvgMetadata } from '../types/svg';

interface SvgPreviewProps {
  svgCode: string;
  metadata: SvgMetadata;
  background: BackgroundConfig;
}

export const SvgPreview: React.FC<SvgPreviewProps> = ({
  svgCode,
  metadata,
  background,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [bgMode, setBgMode] = useState<'match' | 'checker-dark' | 'checker-light' | 'black'>('match');

  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom handlers
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 4));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.25));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Generate background style
  const getContainerBgStyle = (): React.CSSProperties => {
    if (bgMode === 'checker-dark') return {};
    if (bgMode === 'checker-light') return {};
    if (bgMode === 'black') return { backgroundColor: '#000000' };

    // Match video background
    if (background.type === 'solid') {
      return { backgroundColor: background.color };
    }
    if (background.type === 'gradient') {
      const { angle, startColor, endColor, type } = background.gradient;
      if (type === 'radial') {
        return { backgroundImage: `radial-gradient(circle at center, ${startColor}, ${endColor})` };
      }
      return { backgroundImage: `linear-gradient(${angle}deg, ${startColor}, ${endColor})` };
    }
    return { backgroundColor: '#000000' };
  };

  const getContainerBgClass = () => {
    if (bgMode === 'checker-dark') return 'bg-checkerboard';
    if (bgMode === 'checker-light') return 'bg-checkerboard-light';
    return '';
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
      {/* Top Toolbar */}
      <div className="px-4 py-3 bg-zinc-900/70 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-200 text-xs font-semibold">
            <Eye className="w-3.5 h-3.5 text-purple-400" />
            <span>Interactive Vector Preview</span>
          </div>

          <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800/50 px-2 py-0.5 rounded border border-zinc-700/40">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        {/* Viewport & Background Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs">
          {/* Background switcher */}
          <div className="flex items-center bg-zinc-800/80 p-0.5 rounded-lg border border-zinc-700/50 text-[11px]">
            <button
              onClick={() => setBgMode('match')}
              className={`px-2 py-0.5 rounded transition-colors ${
                bgMode === 'match' ? 'bg-indigo-600 text-white font-medium shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Preview with exact video background"
            >
              Video BG
            </button>
            <button
              onClick={() => setBgMode('checker-dark')}
              className={`px-2 py-0.5 rounded transition-colors ${
                bgMode === 'checker-dark' ? 'bg-indigo-600 text-white font-medium shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Dark transparency checkerboard"
            >
              Dark Grid
            </button>
            <button
              onClick={() => setBgMode('checker-light')}
              className={`px-2 py-0.5 rounded transition-colors ${
                bgMode === 'checker-light' ? 'bg-indigo-600 text-white font-medium shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Light transparency checkerboard"
            >
              Light Grid
            </button>
          </div>

          {/* Zoom & Pan Tools */}
          <div className="flex items-center space-x-1 bg-zinc-800/60 p-0.5 rounded-lg border border-zinc-700/50">
            <button
              onClick={handleZoomIn}
              className="p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/60 rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/60 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/60 rounded"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Preview Viewport Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={getContainerBgStyle()}
        className={`relative flex-1 min-h-[360px] max-h-[460px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none ${getContainerBgClass()}`}
      >
        {metadata.isValid && svgCode.trim() ? (
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            }}
            className="w-full h-full max-w-[90%] max-h-[90%] flex items-center justify-center pointer-events-none drop-shadow-2xl"
            dangerouslySetInnerHTML={{ __html: svgCode }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-500 p-6 text-center">
            <AlertTriangle className="w-10 h-10 text-amber-500/80 mb-2" />
            <p className="text-sm font-medium text-zinc-300">No Valid SVG to Preview</p>
            <p className="text-xs text-zinc-500 max-w-xs mt-1">
              Paste standard SVG code or select an animated preset to start previewing.
            </p>
          </div>
        )}

        {/* Pan hint banner */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 px-2 py-1 rounded bg-black/60 backdrop-blur-xs border border-white/10 text-[10px] text-zinc-400 pointer-events-none">
          <Move className="w-3 h-3 text-zinc-500" />
          <span>Click & drag to pan • Scroll/buttons to zoom</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 bg-zinc-900/90 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
        <div className="flex items-center space-x-2">
          <span>Vector Scalability:</span>
          <span className="text-emerald-400 font-medium">Infinite (Vector Clean at 3840×2160)</span>
        </div>
        <div className="flex items-center space-x-1">
          <Maximize2 className="w-3 h-3 text-zinc-500" />
          <span>Full Real-Time DOM Animation Engine</span>
        </div>
      </div>
    </div>
  );
};
