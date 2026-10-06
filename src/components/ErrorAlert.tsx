import React from 'react';
import { AlertCircle, X, ExternalLink } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onDismiss: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  const isWebCodecsError = message.toLowerCase().includes('webcodecs') || message.toLowerCase().includes('videoencoder');

  return (
    <div className="bg-[#12060a]/95 backdrop-blur-md border border-rose-500/30 rounded-2xl p-4 sm:p-5 text-rose-200 shadow-2xl shadow-black/80 flex items-start justify-between gap-3 animate-in fade-in duration-150 relative overflow-hidden">
      <div className="flex items-start space-x-3.5">
        <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 shrink-0 mt-0.5">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-rose-100 font-cinzel tracking-wide">Validation or Hardware Notice</h4>
          <p className="text-xs text-rose-200/90 leading-relaxed font-sans">{message}</p>
          {isWebCodecsError && (
            <p className="text-[11px] text-rose-300 mt-1 flex items-center space-x-1.5 font-mono">
              <span>WebCodecs requires modern GPU support (Chrome 94+, Edge 94+, Safari 16.4+, Firefox 130+).</span>
              <a
                href="https://caniuse.com/webcodecs"
                target="_blank"
                rel="noreferrer"
                className="underline flex items-center hover:text-rose-100 transition-colors"
              >
                <span>Check compatibility</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </p>
          )}
        </div>
      </div>

      <button
        onClick={onDismiss}
        className="p-1.5 text-rose-400 hover:text-rose-100 rounded-lg hover:bg-rose-950/80 transition-colors cursor-pointer"
        title="Dismiss notice"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
