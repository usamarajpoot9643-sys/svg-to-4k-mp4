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
    <div className="bg-rose-950/70 border border-rose-800/80 rounded-2xl p-4 sm:p-5 text-rose-200 shadow-xl flex items-start justify-between gap-3 animate-in fade-in duration-150">
      <div className="flex items-start space-x-3">
        <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0 mt-0.5">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-rose-100">Encoding or Validation Notice</h4>
          <p className="text-xs text-rose-300 leading-relaxed">{message}</p>
          {isWebCodecsError && (
            <p className="text-[11px] text-rose-400 mt-1 flex items-center space-x-1">
              <span>WebCodecs requires Chrome 94+, Edge 94+, Safari 16.4+, or Firefox 130+.</span>
              <a
                href="https://caniuse.com/webcodecs"
                target="_blank"
                rel="noreferrer"
                className="underline flex items-center hover:text-white"
              >
                <span>Check browser compatibility</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </p>
          )}
        </div>
      </div>

      <button
        onClick={onDismiss}
        className="p-1 text-rose-400 hover:text-white rounded-lg hover:bg-rose-900/60 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
