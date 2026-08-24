import React from 'react';
import { Clock, Bell, BellOff, ArrowUpRight, Compass, Sparkles } from 'lucide-react';
import { AppSettings, PrayerTimeItem } from '../types';

interface Props {
  nextPrayer: PrayerTimeItem | null;
  currentPrayer: PrayerTimeItem | null;
  timeRemainingFormatted: string;
  progressPercentage: number;
  settings: AppSettings;
  onToggleNotification: (prayerId: string) => void;
  onViewAllPrayers: () => void;
}

export const NextPrayerCard: React.FC<Props> = ({
  nextPrayer,
  currentPrayer,
  timeRemainingFormatted,
  progressPercentage,
  settings,
  onToggleNotification,
  onViewAllPrayers,
}) => {
  const isUrdu = settings.language === 'ur';

  if (!nextPrayer) return null;

  const isNotifOn = settings.prayerNotifications[nextPrayer.id] ?? true;

  return (
    <div
      id="next-prayer-hero-card"
      className="relative overflow-hidden rounded-[32px] bg-[#2D5A27] text-white p-6 sm:p-8 shadow-lg shadow-[#2D5A27]/20 border border-[#2D5A27] transition-all"
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      {/* Decorative Subtle Radial Blur Glow from design */}
      <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-[#C5A059]/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top row: Status tag & Quick Notification Toggle */}
      <div className="relative z-10 flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <p className="text-[#C5A059] uppercase tracking-[0.2em] text-xs font-bold">
            {isUrdu ? 'اگلی نماز' : 'Next Prayer'}
          </p>
          {currentPrayer && (
            <span className="text-xs text-white/70 hidden xs:inline">
              {isUrdu
                ? `(ابھی ${currentPrayer.nameUr} کا وقت ہے)`
                : `(Active: ${currentPrayer.nameEn})`}
            </span>
          )}
        </div>

        <button
          id={`toggle-notif-hero-${nextPrayer.id}`}
          onClick={() => onToggleNotification(nextPrayer.id)}
          title={
            isNotifOn
              ? isUrdu
                ? 'اذان الارم بند کریں'
                : 'Mute reminder for this prayer'
              : isUrdu
                ? 'اذان الارم آن کریں'
                : 'Turn on reminder for this prayer'
          }
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all border ${
            isNotifOn
              ? 'bg-[#C5A059]/20 text-[#C5A059] border-[#C5A059]/50 hover:bg-[#C5A059]/30'
              : 'bg-black/20 text-white/60 border-white/20 hover:text-white'
          }`}
        >
          {isNotifOn ? <Bell className="w-3.5 h-3.5 fill-[#C5A059]" /> : <BellOff className="w-3.5 h-3.5" />}
          <span>{isNotifOn ? (isUrdu ? 'الارم فعال' : 'Alarm On') : (isUrdu ? 'خاموش' : 'Silent')}</span>
        </button>
      </div>

      {/* Middle row: Big Prayer Name, Arabic calligraphy, and Start Time */}
      <div className="relative z-10 flex items-baseline justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              {isUrdu ? nextPrayer.nameUr : nextPrayer.nameEn}
            </h2>
            <span className="font-arabic text-2xl sm:text-3xl text-[#C5A059] font-normal px-1">
              {nextPrayer.arabicName}
            </span>
          </div>
          <p className="text-white/80 text-xs sm:text-sm mt-1">
            {isUrdu ? `مقررہ وقت: ${nextPrayer.formattedTime}` : `Starts at ${nextPrayer.formattedTime}`}
          </p>
        </div>

        {/* Big Time Display */}
        <div className="text-right shrink-0" dir="ltr">
          <div className="text-2xl sm:text-4xl font-extrabold font-mono text-[#C5A059] tracking-tight">
            {nextPrayer.formattedTime}
          </div>
        </div>
      </div>

      {/* Countdown Timer Box */}
      <div className="relative z-10 bg-black/25 rounded-2xl p-4 border border-white/10 backdrop-blur-xs">
        <div className="flex items-center justify-between text-xs text-white/75 mb-2">
          <span className="flex items-center gap-1.5 font-medium text-white/90">
            <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
            {isUrdu ? 'باقی ماندہ وقت' : 'Time Remaining'}
          </span>
          <span className="font-mono text-xs text-white/50">
            {isUrdu ? 'گھنٹے : منٹ : سیکنڈ' : 'HH : MM : SS'}
          </span>
        </div>

        {/* Live Countdown numbers */}
        <div className="flex items-center justify-between" dir="ltr">
          <div className="text-3xl sm:text-4xl font-mono font-bold tracking-tighter text-white">
            {timeRemainingFormatted}
          </div>

          <button
            id="view-all-prayers-hero-btn"
            onClick={onViewAllPrayers}
            className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl bg-white text-[#2D5A27] hover:bg-[#F9F8F4] transition-colors shadow-xs"
          >
            <span>{isUrdu ? 'تمام اوقات' : 'Schedule'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#2D5A27]" />
          </button>
        </div>

        {/* Progress Bar of Current Prayer Interval */}
        <div className="mt-3">
          <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#C5A059] h-1.5 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

