import React from 'react';
import { useArena, ToastMessage } from '../../context/ArenaContext';
import { X, Sparkles, Trophy, Award, Info } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toasts, removeToast } = useArena();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast: ToastMessage) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/80 shadow-float text-slate-800 transition-all duration-300 animate-slide-up"
        >
          <div className="flex-shrink-0 mt-0.5">
            {toast.type === 'xp' && (
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
            )}
            {toast.type === 'achievement' && (
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <Trophy className="w-5 h-5" />
              </div>
            )}
            {toast.type === 'success' && (
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
            )}
            {toast.type === 'info' && (
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <Info className="w-5 h-5" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-semibold text-sm text-slate-900 truncate">{toast.title}</h4>
              {toast.xpAmount && (
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  +{toast.xpAmount} XP
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{toast.message}</p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 p-1 -mr-1 -mt-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
