import React from 'react';
import { MapPin, Globe, Volume2, Sparkles, Compass } from 'lucide-react';
import { AppSettings, CityLocation, HijriDate } from '../types';

interface Props {
  settings: AppSettings;
  city: CityLocation;
  hijriDate: HijriDate;
  onOpenSettings: () => void;
  onToggleLanguage: () => void;
  onTestSound: () => void;
}

export const Header: React.FC<Props> = ({
  settings,
  city,
  hijriDate,
  onOpenSettings,
  onToggleLanguage,
  onTestSound,
}) => {
  const isUrdu = settings.language === 'ur';

  // Format today's Gregorian date
  const now = new Date();
  const gregorianDate = now.toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 bg-[#F9F8F4]/95 backdrop-blur-md border-b border-[#E8E6DF] px-4 py-4 sm:px-8 transition-colors"
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      <div className="w-full flex items-center justify-between gap-3">
        {/* Left: Branding & Dates */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-[#2D5A27] rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#2D5A27] tracking-tight">
                {isUrdu ? 'ڈیلی دین' : 'Daily Deen'}
              </h1>
              <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-[#2D5A27]/10 text-[#2D5A27] border border-[#2D5A27]/20">
                {isUrdu ? 'رفیق' : 'Companion'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#4A4A4A] mt-0.5 truncate">
              <span className="font-semibold text-[#2D5A27]">
                {isUrdu ? hijriDate.formattedUr : hijriDate.formattedEn}
              </span>
              <span className="text-[#C5A059] font-bold">•</span>
              <span className="truncate text-stone-500">{gregorianDate}</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Location Chip */}
          <button
            id="header-location-btn"
            onClick={onOpenSettings}
            title={isUrdu ? 'شہر تبدیل کریں' : 'Change Location'}
            className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-full border border-[#E8E6DF] shadow-xs text-xs sm:text-sm font-medium text-[#2D3436] hover:border-[#C5A059] transition-all"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span className="max-w-[85px] sm:max-w-[140px] truncate">
              {isUrdu ? city.nameUr : `${city.nameEn}, ${city.country}`}
            </span>
          </button>

          {/* Sound test button */}
          <button
            id="header-sound-btn"
            onClick={onTestSound}
            title={isUrdu ? 'آواز ٹیسٹ کریں' : 'Test Azan/Chime Sound'}
            aria-label="Test Azan sound"
            className="p-2 rounded-full bg-white text-[#2D3436] border border-[#E8E6DF] hover:text-[#2D5A27] hover:border-[#2D5A27] transition-colors shadow-xs"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Language toggle */}
          <button
            id="header-lang-btn"
            onClick={onToggleLanguage}
            title={isUrdu ? 'Switch to English' : 'اردو میں تبدیل کریں'}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full bg-[#2D5A27] text-white hover:bg-[#23461e] transition-all shadow-xs"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'English' : 'اردو'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

