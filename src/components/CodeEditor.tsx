import React, { useRef, useState } from 'react';
import { 
  Code2, 
  Upload, 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  Wand2, 
  AlertCircle,
  AlertTriangle,
  FileCheck2,
  Activity,
  Layers
} from 'lucide-react';
import type { SvgMetadata, SvgPreset } from '../types/svg';
import { SVG_PRESETS } from '../services/presets';

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  metadata: SvgMetadata;
  onSelectPreset: (preset: SvgPreset) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  metadata,
  onSelectPreset,
}) => {
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Line numbers calculation
  const linesCount = Math.max(1, value.split('\n').length);
  const lineNumbers = Array.from({ length: linesCount }, (_, i) => i + 1);

  // Copy code handler
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Format XML code
  const handleFormat = () => {
    try {
      const PADDING = '  ';
      const reg = /(>)(<)(\/*)/g;
      let xml = value.replace(reg, '$1\r\n$2$3');
      let pad = 0;
      let formatted = '';
      const lines = xml.split('\r\n');

      lines.forEach((node) => {
        let indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
          indent = 0;
        } else if (node.match(/^<\/\w/)) {
          if (pad !== 0) {
            pad -= 1;
          }
        } else if (node.match(/^<\w[^>]*[^/]>.*$/)) {
          indent = 1;
        } else {
          indent = 0;
        }

        let padding = '';
        for (let i = 0; i < pad; i++) {
          padding += PADDING;
        }

        formatted += padding + node + '\r\n';
        pad += indent;
      });

      onChange(formatted.trim());
    } catch {
      // Keep existing value if formatting fails
    }
  };

  // File upload handler
  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith('.svg') && file.type !== 'image/svg+xml') {
      alert('Please upload a valid .svg file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        onChange(content);
      }
    };
    reader.readAsText(file);
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#08080e] border border-amber-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 hover:border-amber-500/35 transition-all duration-300">
      {/* Top Toolbar */}
      <div className="px-4 py-3 bg-[#0d0d15]/90 border-b border-amber-500/15 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase">
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            <span>SVG Source</span>
          </div>

          {/* Preset Selector */}
          <div className="relative">
            <select
              aria-label="Load SVG Animation Preset"
              onChange={(e) => {
                const preset = SVG_PRESETS.find((p) => p.id === e.target.value);
                if (preset) {
                  onSelectPreset(preset);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="bg-zinc-900/90 hover:bg-zinc-900 text-amber-200 text-xs font-medium rounded-xl px-3 py-1.5 pr-8 border border-amber-500/30 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer transition-all shadow-sm"
            >
              <option value="" disabled>Load Preset Example...</option>
              {SVG_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name} ({preset.category})
                </option>
              ))}
            </select>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 absolute right-2.5 top-2 pointer-events-none" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* File Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Upload .svg file"
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-900/80 hover:bg-zinc-900 hover:text-amber-200 border border-amber-500/20 rounded-xl transition-all shadow-sm"
          >
            <Upload className="w-3 h-3 text-amber-400/80" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {/* Format XML */}
          <button
            onClick={handleFormat}
            title="Format XML Code"
            className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-900/80 hover:bg-zinc-900 hover:text-amber-200 border border-amber-500/20 rounded-xl transition-all shadow-sm"
          >
            <Wand2 className="w-3 h-3 text-amber-400/80" />
            <span className="hidden sm:inline">Format</span>
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            title="Copy SVG Code"
            className="p-1.5 text-zinc-400 hover:text-amber-200 bg-zinc-900/80 hover:bg-zinc-900 border border-amber-500/20 rounded-xl transition-all shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Clear */}
          <button
            onClick={() => onChange('')}
            title="Clear Editor"
            className="p-1.5 text-zinc-400 hover:text-rose-400 bg-zinc-900/80 hover:bg-zinc-900 border border-amber-500/20 rounded-xl transition-all shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div 
        className={`relative flex-1 min-h-[360px] max-h-[460px] flex overflow-hidden ${
          dragActive ? 'ring-2 ring-amber-400 bg-amber-500/5' : ''
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Line Numbers Sidebar */}
        <div className="w-12 bg-[#05050a] py-3 pr-3 text-right font-mono text-[11px] text-amber-500/30 select-none border-r border-amber-500/10 overflow-hidden">
          {lineNumbers.map((num) => (
            <div key={num} className="leading-5 h-5">{num}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste raw SVG code here (<svg ...>...</svg>) or drag & drop an .svg file..."
          spellCheck={false}
          className="flex-1 w-full bg-[#07070c] p-3 font-mono text-xs text-zinc-200 leading-5 resize-none focus:outline-none focus:ring-0 selection:bg-amber-500/30 selection:text-amber-200 overflow-y-auto whitespace-pre font-light"
        />

        {/* Drag & drop overlay cue */}
        {dragActive && (
          <div className="absolute inset-0 bg-[#07070c]/90 backdrop-blur-xs flex flex-col items-center justify-center border-2 border-dashed border-amber-400 rounded-xl z-20 pointer-events-none">
            <Upload className="w-10 h-10 text-amber-300 animate-bounce mb-2" />
            <p className="text-sm font-semibold text-white">Drop .svg file to import code</p>
          </div>
        )}
      </div>

      {/* Validation & Metadata Status Bar */}
      <div className="px-4 py-2.5 bg-[#0d0d15]/95 border-t border-amber-500/15 flex flex-wrap items-center justify-between text-xs gap-2">
        <div className="flex items-center space-x-2">
          {metadata.isValid ? (
            <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Valid SVG Document</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-rose-400 font-medium truncate max-w-sm">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{metadata.error || 'Invalid SVG XML'}</span>
            </div>
          )}

          {metadata.isAnimated && (
            <div className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold text-[11px] shadow-xs">
              <Activity className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>
                {metadata.hasCssAnimations && metadata.hasSmilAnimations
                  ? 'CSS & SMIL Animated'
                  : metadata.hasCssAnimations
                  ? 'CSS Animated'
                  : 'SMIL Animated'}
              </span>
            </div>
          )}

          {!metadata.isAnimated && metadata.isValid && (
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-amber-500/20 text-zinc-300 text-[11px] font-medium">
              Static Vector Graphic
            </span>
          )}

          {metadata.hasForeignObject && (
            <div 
              className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold text-[11px]" 
              title="SVG contains <foreignObject>. Browsers taint the canvas when rendering HTML, preventing 4K WebCodecs export."
            >
              <AlertTriangle className="w-3 h-3" />
              <span>&lt;foreignObject&gt; Detected</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3 text-zinc-400 text-[11px]">
          {metadata.elementCount > 0 && (
            <div className="flex items-center space-x-1">
              <Layers className="w-3 h-3 text-zinc-500" />
              <span>{metadata.elementCount} elements</span>
            </div>
          )}
          {metadata.viewBox && (
            <span className="font-mono bg-zinc-800/80 px-1.5 py-0.5 rounded text-zinc-300">
              {metadata.viewBox}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
