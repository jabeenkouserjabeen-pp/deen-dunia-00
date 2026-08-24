import React from 'react';
import { Bell, X, CheckCircle2, Heart } from 'lucide-react';
import { InAppAlert } from '../services/notificationService';

interface Props {
  alert: InAppAlert | null;
  onDismiss: () => void;
  language: 'en' | 'ur';
}

export const InAppNotificationToast: React.FC<Props> = ({ alert, onDismiss, language }) => {
  if (!alert) return null;

  const isUrdu = language === 'ur';

  return (
    <aside
      aria-label="Prayer notification alert"
      id="prayer-notification-toast"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md bg-[#2D5A27] text-white backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-[#2D5A27] flex items-start gap-3.5 animate-in fade-in slide-in-from-top-4 duration-300"
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0 mt-0.5 text-[#C5A059]">
        {alert.type === 'sadqa' ? (
          <Heart className="w-5 h-5 fill-[#C5A059] text-[#C5A059]" />
        ) : (
          <Bell className="w-5 h-5 animate-bounce" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-[#C5A059] truncate">{alert.title}</h4>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-black/20 text-white/90 shrink-0">
            {alert.time}
          </span>
        </div>
        <p className="text-xs text-white/85 mt-1 leading-relaxed">{alert.body}</p>
      </div>

      <button
        id="dismiss-toast-btn"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/15 transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </aside>
  );
};
