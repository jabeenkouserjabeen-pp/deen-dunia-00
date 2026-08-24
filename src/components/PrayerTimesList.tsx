import React from 'react';
import { Bell, BellOff, Sun, Sunset, Moon, Sunrise, Compass, Sparkles, SlidersHorizontal } from 'lucide-react';
import { AppSettings, CityLocation, PrayerTimeItem } from '../types';

interface Props {
  prayerItems: PrayerTimeItem[];
  settings: AppSettings;
  city: CityLocation;
  onToggleNotification: (prayerId: string) => void;
  onOpenSettings: () => void;
}

export const PrayerTimesList: React.FC<Props> = ({
  prayerItems,
  settings,
  city,
  onToggleNotification,
  onOpenSettings,
}) => {
  const isUrdu = settings.language === 'ur';

  const getPrayerIcon = (id: string, isHighlighted: boolean) => {
    const iconClass = `w-5 h-5 ${isHighlighted ? 'text-[#C5A059]' : 'text-[#2D5A27]'}`;
    switch (id) {
      case 'fajr':
        return <Sunrise className={iconClass} />;
      case 'sunrise':
        return <Sun className={iconClass} />;
      case 'dhuhr':
        return <Sun className={iconClass} />;
      case 'asr':
        return <Sun className={iconClass} />;
      case 'maghrib':
        return <Sunset className={iconClass} />;
      case 'isha':
        return <Moon className={iconClass} />;
      default:
        return <Sun className={iconClass} />;
    }
  };

  return (
    <div
      id="prayer-times-section"
      className="bg-white rounded-[32px] p-6 shadow-xs border border-[#E8E6DF] transition-all"
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      {/* Header with Geometric Balance Gold Bar */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-2">
        <h3 className="text-lg font-bold text-[#2D3436] flex items-center gap-2.5">
          <span className="w-1.5 h-6 bg-[#C5A059] rounded-full shrink-0"></span>
          <span>{isUrdu ? "آج کے اوقاتِ نماز" : "Prayer Schedule"}</span>
        </h3>

        <button
          id="prayer-settings-btn"
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F9F8F4] hover:bg-[#E8E6DF] text-[#4A4A4A] border border-[#E8E6DF] transition-colors"
          title={isUrdu ? 'اوقات کی ترتیبات' : 'Prayer Settings'}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#2D5A27]" />
          <span>{isUrdu ? 'ترمیم' : 'Adjust'}</span>
        </button>
      </div>

      {/* Prayer Times Rows */}
      <div className="space-y-3">
        {prayerItems.map((item) => {
          const isHighlight = item.isNext;
          const isCurrent = item.isCurrent;
          const isSunrise = item.id === 'sunrise';
          const notifEnabled = settings.prayerNotifications[item.id] ?? false;

          return (
            <div
              key={item.id}
              id={`prayer-row-${item.id}`}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                isHighlight
                  ? 'bg-[#2D5A27] text-white border-2 border-[#C5A059] shadow-sm'
                  : isCurrent
                  ? 'bg-[#FFF9EA] text-[#2D3436] border border-[#F3E5C2]'
                  : 'bg-[#F9F8F4] text-[#2D3436] hover:bg-[#F0EFEA] border border-transparent'
              }`}
            >
              {/* Left: Icon, Name, Arabic */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isHighlight
                      ? 'bg-white/15 text-white'
                      : isCurrent
                      ? 'bg-[#C5A059]/20 text-[#2D5A27]'
                      : 'bg-white text-[#2D5A27] border border-[#E8E6DF]'
                  }`}
                >
                  {getPrayerIcon(item.id, isHighlight)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold truncate ${
                        isHighlight ? 'text-white' : 'text-[#2D3436]'
                      }`}
                    >
                      {isUrdu ? item.nameUr : item.nameEn}
                    </span>

                    {isHighlight && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C5A059] text-white">
                        {isUrdu ? 'اگلی' : 'Next'}
                      </span>
                    )}

                    {isCurrent && !isHighlight && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#C5A059]/20 text-[#2D5A27]">
                        {isUrdu ? 'جاری' : 'Active'}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs font-arabic ${
                      isHighlight ? 'text-white/70' : 'text-stone-400'
                    }`}
                  >
                    {item.arabicName}
                  </span>
                </div>
              </div>

              {/* Right: Time & Notification Bell */}
              <div className="flex items-center gap-3 shrink-0" dir="ltr">
                <span
                  className={`text-base font-mono font-bold tracking-tight ${
                    isHighlight
                      ? 'text-white'
                      : item.hasPassed
                      ? 'text-stone-400'
                      : 'text-[#2D5A27]'
                  }`}
                >
                  {item.formattedTime}
                </span>

                {/* Notification Toggle (not for Sunrise) */}
                {!isSunrise ? (
                  <button
                    id={`toggle-prayer-notif-${item.id}`}
                    onClick={() => onToggleNotification(item.id)}
                    aria-label={`Toggle alarm for ${item.nameEn}`}
                    title={
                      notifEnabled
                        ? isUrdu
                          ? 'الارم بند کریں'
                          : 'Turn off notification'
                        : isUrdu
                          ? 'الارم آن کریں'
                          : 'Turn on notification'
                    }
                    className={`p-1.5 rounded-lg transition-all ${
                      isHighlight
                        ? notifEnabled
                          ? 'text-[#C5A059] bg-white/10 hover:bg-white/20'
                          : 'text-white/40 hover:text-white'
                        : notifEnabled
                        ? 'text-[#2D5A27] bg-[#2D5A27]/10 hover:bg-[#2D5A27]/20'
                        : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    {notifEnabled ? (
                      <Bell className={`w-4 h-4 ${isHighlight ? 'fill-[#C5A059]' : 'fill-[#2D5A27]'}`} />
                    ) : (
                      <BellOff className="w-4 h-4" />
                    )}
                  </button>
                ) : (
                  <div className="w-7" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

