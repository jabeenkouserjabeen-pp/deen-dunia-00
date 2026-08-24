import React, { useState } from 'react';
import {
  X,
  MapPin,
  Compass,
  Bell,
  Volume2,
  Globe,
  Clock,
  Sliders,
  Check,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { ALL_CITIES, PAKISTAN_CITIES } from '../data/cities';
import { AppSettings, CalculationMethodKey, JuristicMethod } from '../types';
import { audioService } from '../services/audioService';
import { notificationService } from '../services/notificationService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const SettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const isUrdu = settings.language === 'ur';
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  const handleCityChange = (cityId: string) => {
    onUpdateSettings({
      ...settings,
      useGPS: false,
      selectedCityId: cityId,
    });
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsMessage(isUrdu ? 'آپ کا براؤزر جی پی ایس کو سپورٹ نہیں کرتا۔' : 'Geolocation is not supported by your browser.');
      return;
    }

    setGpsLoading(true);
    setGpsMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLoading(false);
        onUpdateSettings({
          ...settings,
          useGPS: true,
          customCoordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            name: isUrdu ? 'موجودہ مقام (جی پی ایس)' : 'GPS Location',
          },
        });
        setGpsMessage(isUrdu ? 'مقام کامیابی سے حاصل کر لیا گیا!' : 'GPS location updated successfully!');
      },
      (error) => {
        setGpsLoading(false);
        setGpsMessage(
          isUrdu
            ? 'جی پی ایس کی اجازت نہیں ملی۔ براہ کرم نیچے سے شہر منتخب کریں۔'
            : 'GPS permission denied. Please select your city from the list below.'
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleTestSound = (type: AppSettings['soundType']) => {
    audioService.playByType(type);
  };

  const handleRequestNotifPermission = async () => {
    const res = await notificationService.requestPermission();
    if (res === 'granted') {
      audioService.playNotificationBeep();
    }
  };

  return (
    <div
      id="settings-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-lg max-h-[90vh] bg-[#F9F8F4] rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-[#E8E6DF]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#E8E6DF] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2D5A27] text-white flex items-center justify-center shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#2D3436]">
                {isUrdu ? 'ایپ کی ترتیبات' : 'Settings & Preferences'}
              </h2>
              <p className="text-xs text-[#4A4A4A]">
                {isUrdu ? 'مقام، اوقاتِ نماز اور اطلاعات' : 'Location, prayer calculation & alerts'}
              </p>
            </div>
          </div>

          <button
            id="close-settings-btn"
            onClick={onClose}
            aria-label="Close settings"
            className="p-2 rounded-full text-stone-400 hover:text-[#2D3436] hover:bg-[#F9F8F4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* 1. Location Settings */}
          <div className="bg-white p-5 rounded-[24px] border border-[#E8E6DF] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#2D3436] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2D5A27]" />
                {isUrdu ? 'مقام اور شہر' : 'Location & City'}
              </h3>
              {settings.useGPS && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#2D5A27]/10 text-[#2D5A27] border border-[#2D5A27]/20">
                  GPS Active
                </span>
              )}
            </div>

            {/* GPS Button */}
            <button
              id="detect-gps-btn"
              onClick={handleDetectGPS}
              disabled={gpsLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#F9F8F4] hover:bg-[#E8E6DF] border border-[#E8E6DF] text-[#2D5A27] text-xs font-bold transition-colors"
            >
              <Compass className={`w-4 h-4 ${gpsLoading ? 'animate-spin' : ''}`} />
              <span>
                {gpsLoading
                  ? isUrdu
                    ? 'جی پی ایس تلاش کیا جا رہا ہے...'
                    : 'Locating via GPS...'
                  : isUrdu
                  ? 'موجودہ مقام خودکار معلوم کریں (GPS)'
                  : 'Auto-Detect Current Location (GPS)'}
              </span>
            </button>

            {gpsMessage && (
              <p className="text-xs text-[#2D3436] bg-[#F9F8F4] p-3 rounded-xl border border-[#E8E6DF]">
                {gpsMessage}
              </p>
            )}

            {/* City Selector */}
            <div className="space-y-1.5 pt-1">
              <label htmlFor="city-select-dropdown" className="text-xs font-semibold text-[#4A4A4A]">
                {isUrdu ? 'یا پاکستان کا شہر منتخب کریں:' : 'Or Select City:'}
              </label>
              <select
                id="city-select-dropdown"
                value={settings.useGPS ? 'gps' : settings.selectedCityId}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full bg-[#F9F8F4] border border-[#E8E6DF] rounded-xl p-2.5 text-xs sm:text-sm text-[#2D3436] focus:ring-2 focus:ring-[#2D5A27]/20"
              >
                <optgroup label={isUrdu ? 'پاکستان کے بڑے شہر' : 'Pakistan Major Cities'}>
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {isUrdu ? `${c.nameUr} (${c.nameEn})` : `${c.nameEn} (${c.province || c.country})`}
                    </option>
                  ))}
                </optgroup>
                <optgroup label={isUrdu ? 'بین الاقوامی شہر' : 'International Cities'}>
                  {ALL_CITIES.slice(PAKISTAN_CITIES.length).map((c) => (
                    <option key={c.id} value={c.id}>
                      {isUrdu ? `${c.nameUr} (${c.country})` : `${c.nameEn} (${c.country})`}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* 2. Calculation Method & Fiqh / Asr */}
          <div className="bg-white p-5 rounded-[24px] border border-[#E8E6DF] space-y-3 shadow-xs">
            <h3 className="text-sm font-bold text-[#2D3436] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#2D5A27]" />
              {isUrdu ? 'طریقۂ حساب و فقہی مسلک' : 'Calculation Method & Asr Juristic'}
            </h3>

            {/* Asr Juristic (Hanafi vs Shafi) */}
            <div className="space-y-1.5">
              <label htmlFor="asr-method-select" className="text-xs font-semibold text-[#4A4A4A]">
                {isUrdu ? 'عصر کی نماز کا وقت (مسلک):' : 'Asr Juristic Method (Madhab):'}
              </label>
              <select
                id="asr-method-select"
                value={settings.juristicMethod}
                onChange={(e) =>
                  onUpdateSettings({
                    ...settings,
                    juristicMethod: e.target.value as JuristicMethod,
                  })
                }
                className="w-full bg-[#F9F8F4] border border-[#E8E6DF] rounded-xl p-2.5 text-xs sm:text-sm text-[#2D3436]"
              >
                <option value="Hanafi">
                  {isUrdu ? 'حنفی (پاکستان میں رائج - سایہ دوگنا)' : 'Hanafi (Standard in Pakistan & South Asia)'}
                </option>
                <option value="Shafi">
                  {isUrdu ? 'شافعی / مالکی / حنبلی (سایہ ایک گنا)' : 'Shafi / Hanbali / Maliki (Standard shadow)'}
                </option>
              </select>
            </div>

            {/* Calculation Authority */}
            <div className="space-y-1.5">
              <label htmlFor="calc-method-select" className="text-xs font-semibold text-[#4A4A4A]">
                {isUrdu ? 'اوقات کا ادارہ / قاعدہ:' : 'Calculation Authority:'}
              </label>
              <select
                id="calc-method-select"
                value={settings.calculationMethod}
                onChange={(e) =>
                  onUpdateSettings({
                    ...settings,
                    calculationMethod: e.target.value as CalculationMethodKey,
                  })
                }
                className="w-full bg-[#F9F8F4] border border-[#E8E6DF] rounded-xl p-2.5 text-xs sm:text-sm text-[#2D3436]"
              >
                <option value="Karachi">
                  {isUrdu ? 'جامعۃ العلوم الاسلامیہ کراچی (پاکستان)' : 'University of Islamic Sciences, Karachi (Pakistan)'}
                </option>
                <option value="MuslimWorldLeague">
                  {isUrdu ? 'رابطۃ العالم الاسلامی (مکہ مکرمہ)' : 'Muslim World League (MWL)'}
                </option>
                <option value="UmmAlQura">
                  {isUrdu ? 'جامعہ ام القریٰ (سعودی عرب)' : 'Umm al-Qura University (Makkah)'}
                </option>
                <option value="Egyptian">
                  {isUrdu ? 'مصری جنرل اتھارٹی آف سروے' : 'Egyptian General Authority of Survey'}
                </option>
                <option value="ISNA">
                  {isUrdu ? 'اسلامک سوسائٹی آف نارتھ امریکہ (ISNA)' : 'Islamic Society of North America (ISNA)'}
                </option>
                <option value="Dubai">Dubai (UAE)</option>
              </select>
            </div>
          </div>

          {/* 3. Notifications & Azan Sounds */}
          <div className="bg-white p-5 rounded-[24px] border border-[#E8E6DF] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#2D3436] flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#2D5A27]" />
                {isUrdu ? 'نماز کی اطلاعات و اذان' : 'Prayer Notifications & Audio'}
              </h3>
              <button
                onClick={handleRequestNotifPermission}
                className="text-[11px] font-bold text-[#2D5A27] hover:underline"
              >
                {isUrdu ? 'اجازت چیک کریں' : 'Check Permission'}
              </button>
            </div>

            {/* 10 min before toggle */}
            <label className="flex items-center justify-between p-3 bg-[#F9F8F4] rounded-2xl cursor-pointer">
              <span className="text-xs font-semibold text-[#2D3436]">
                {isUrdu ? 'نماز سے 10 منٹ قبل یاد دہانی' : '10-minute pre-prayer warning'}
              </span>
              <input
                type="checkbox"
                checked={settings.reminder10MinBefore}
                onChange={(e) =>
                  onUpdateSettings({
                    ...settings,
                    reminder10MinBefore: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-[#2D5A27] rounded"
              />
            </label>

            {/* Daily Sadqa Nudge toggle */}
            <label className="flex items-center justify-between p-3 bg-[#F9F8F4] rounded-2xl cursor-pointer">
              <span className="text-xs font-semibold text-[#2D3436]">
                {isUrdu ? 'روزانہ صدقہ کی یاد دہانی' : 'Daily Sadqa gentle reminder'}
              </span>
              <input
                type="checkbox"
                checked={settings.sadqaReminderEnabled}
                onChange={(e) =>
                  onUpdateSettings({
                    ...settings,
                    sadqaReminderEnabled: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-[#2D5A27] rounded"
              />
            </label>

            {/* Sound Style */}
            <div className="space-y-1.5 pt-1">
              <label htmlFor="sound-style-select" className="text-xs font-semibold text-[#4A4A4A]">
                {isUrdu ? 'آواز کی قسم:' : 'Alert Sound Type:'}
              </label>
              <div className="flex gap-2">
                <select
                  id="sound-style-select"
                  value={settings.soundType}
                  onChange={(e) =>
                    onUpdateSettings({
                      ...settings,
                      soundType: e.target.value as AppSettings['soundType'],
                    })
                  }
                  className="flex-1 bg-[#F9F8F4] border border-[#E8E6DF] rounded-xl p-2.5 text-xs text-[#2D3436]"
                >
                  <option value="gentle">
                    {isUrdu ? 'پُرسکون گھنٹی (Gentle Chime)' : 'Gentle Chime (Peaceful Tone)'}
                  </option>
                  <option value="takbeer">
                    {isUrdu ? 'تکبیر کی دھن (Takbeer Harmony)' : 'Takbeer Harmony (Melodic)'}
                  </option>
                  <option value="beep">
                    {isUrdu ? 'معیاری بیپ (Standard Beep)' : 'Standard Notification Beep'}
                  </option>
                  <option value="silent">
                    {isUrdu ? 'خاموش (Silent / Toast Only)' : 'Silent (Visual Only)'}
                  </option>
                </select>
                <button
                  type="button"
                  onClick={() => handleTestSound(settings.soundType)}
                  className="px-3.5 py-2.5 bg-white border border-[#E8E6DF] hover:bg-[#F9F8F4] rounded-xl text-[#2D3436] text-xs font-semibold shadow-xs"
                  title="Test Sound"
                >
                  <Volume2 className="w-4 h-4 text-[#2D5A27]" />
                </button>
              </div>
            </div>
          </div>

          {/* 4. Display & Language */}
          <div className="bg-white p-5 rounded-[24px] border border-[#E8E6DF] space-y-3 shadow-xs">
            <h3 className="text-sm font-bold text-[#2D3436] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#2D5A27]" />
              {isUrdu ? 'زبان و وقت کا فارمیٹ' : 'Language & Time Format'}
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, language: 'en' })}
                className={`p-3 rounded-2xl text-xs font-bold transition-all border ${
                  settings.language === 'en'
                    ? 'bg-[#2D5A27] text-white border-[#2D5A27] shadow-xs'
                    : 'bg-[#F9F8F4] text-[#2D3436] border-[#E8E6DF]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, language: 'ur' })}
                className={`p-3 rounded-2xl text-xs font-bold transition-all border ${
                  settings.language === 'ur'
                    ? 'bg-[#2D5A27] text-white border-[#2D5A27] shadow-xs'
                    : 'bg-[#F9F8F4] text-[#2D3436] border-[#E8E6DF]'
                }`}
              >
                اردو (Urdu)
              </button>
            </div>

            <label className="flex items-center justify-between p-3 bg-[#F9F8F4] rounded-2xl cursor-pointer">
              <span className="text-xs font-semibold text-[#2D3436]">
                {isUrdu ? '24 گھنٹے کا فارمیٹ (24-Hour Time)' : 'Use 24-hour time format'}
              </span>
              <input
                type="checkbox"
                checked={settings.timeFormat24h}
                onChange={(e) =>
                  onUpdateSettings({
                    ...settings,
                    timeFormat24h: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-[#2D5A27] rounded"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E8E6DF] flex items-center justify-between">
          <span className="text-[11px] text-stone-400">
            Daily Deen v1.0 • 100% Offline Ready
          </span>
          <button
            id="settings-done-btn"
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-[#2D5A27] hover:bg-[#23461e] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
          >
            {isUrdu ? 'محفوظ کریں' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
