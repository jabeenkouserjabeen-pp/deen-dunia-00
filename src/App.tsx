import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AppSettings, CityLocation, HijriDate, PrayerTimeItem, SadqaLogEntry, DuaItem } from './types';
import { storageService, DEFAULT_SETTINGS } from './services/storageService';
import { prayerService } from './services/prayerService';
import { audioService } from './services/audioService';
import { notificationService, InAppAlert } from './services/notificationService';
import { getTodayDua } from './data/duas';
import { getTodayReflection } from './data/hadiths';

import { Header } from './components/Header';
import { NextPrayerCard } from './components/NextPrayerCard';
import { PrayerTimesList } from './components/PrayerTimesList';
import { DailyDuaCard } from './components/DailyDuaCard';
import { SadqaNudgeCard } from './components/SadqaNudgeCard';
import { GiveDirectory } from './components/GiveDirectory';
import { DuaLibraryModal } from './components/DuaLibraryModal';
import { SettingsModal } from './components/SettingsModal';
import { BottomNav, TabType } from './components/BottomNav';
import { InAppNotificationToast } from './components/InAppNotificationToast';

export default function App() {
  // 1. Core State
  const [settings, setSettings] = useState<AppSettings>(() => storageService.getSettings());
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDuaLibraryOpen, setIsDuaLibraryOpen] = useState(false);

  // Sadqa and Dua State
  const [sadqaLogs, setSadqaLogs] = useState<SadqaLogEntry[]>(() => storageService.getSadqaLogs());
  const [readDuaIds, setReadDuaIds] = useState<string[]>(() => storageService.getReadDuaIds());
  const [hasLoggedSadqaToday, setHasLoggedSadqaToday] = useState<boolean>(() => storageService.hasLoggedSadqaToday());

  // Alerts & Notifications Toast
  const [activeAlert, setActiveAlert] = useState<InAppAlert | null>(null);

  // Tick for countdown timer
  const [nowDate, setNowDate] = useState<Date>(() => new Date());

  // 2. Computed Data
  const city: CityLocation = useMemo(() => prayerService.getCityLocation(settings), [settings]);
  const hijriDate: HijriDate = useMemo(() => prayerService.getHijriDate(nowDate), [nowDate]);
  const todayDua = useMemo(() => getTodayDua(), []);
  const todayReflection = useMemo(() => getTodayReflection(), []);

  // Computed Prayers
  const prayerCalc = useMemo(() => {
    return prayerService.calculateTodayPrayers(settings, nowDate);
  }, [settings, nowDate]);

  // 3. Handlers
  const handleUpdateSettings = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
  }, []);

  const handleToggleLanguage = useCallback(() => {
    const newLang = settings.language === 'en' ? 'ur' : 'en';
    handleUpdateSettings({ ...settings, language: newLang });
  }, [settings, handleUpdateSettings]);

  const handleToggleNotification = useCallback((prayerId: string) => {
    const current = settings.prayerNotifications[prayerId as keyof typeof settings.prayerNotifications] ?? true;
    const updated = {
      ...settings.prayerNotifications,
      [prayerId]: !current,
    };
    handleUpdateSettings({
      ...settings,
      prayerNotifications: updated,
    });
    // Give audio feedback
    if (!current) {
      audioService.playNotificationBeep();
    }
  }, [settings, handleUpdateSettings]);

  const handleLogSadqa = useCallback((type: SadqaLogEntry['type']) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = storageService.addSadqaLog({
      date: today,
      type,
    });
    setSadqaLogs(updated);
    setHasLoggedSadqaToday(true);
  }, []);

  const handleToggleReadDua = useCallback((duaId: string) => {
    const isNowRead = storageService.toggleReadDua(duaId);
    setReadDuaIds(storageService.getReadDuaIds());
    if (isNowRead) {
      audioService.playSadqaJoyTone();
    }
  }, []);

  const handleTestSound = useCallback(() => {
    audioService.playByType(settings.soundType);
  }, [settings.soundType]);

  // 4. Effects: Timer loop for countdown and prayer notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const current = new Date();
      setNowDate(current);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Periodic alert check (every 10s)
  useEffect(() => {
    if (prayerCalc.items && prayerCalc.items.length > 0) {
      notificationService.checkAndTriggerAlerts(prayerCalc.items, settings);
    }
  }, [nowDate, prayerCalc.items, settings]);

  // Subscribe to in-app notification alerts
  useEffect(() => {
    const unsub = notificationService.addListener((alert) => {
      setActiveAlert(alert);
      // Auto dismiss after 8 seconds
      setTimeout(() => {
        setActiveAlert((curr) => (curr?.id === alert.id ? null : curr));
      }, 8000);
    });
    return unsub;
  }, []);

  const isUrdu = settings.language === 'ur';

  return (
    <div className="min-h-screen bg-[#F0EEE6] text-[#2D3436] flex flex-col font-display antialiased">
      {/* Active in-app Notification Alert Toast */}
      <InAppNotificationToast
        alert={activeAlert}
        onDismiss={() => setActiveAlert(null)}
        language={settings.language}
      />

      {/* Main Container - Centered Mobile / Tablet Viewport */}
      <div className="w-full max-w-xl mx-auto min-h-screen bg-[#F9F8F4] shadow-xs flex flex-col pb-24 border-x border-[#E8E6DF] relative">
        {/* Top App Header */}
        <Header
          settings={settings}
          city={city}
          hijriDate={hijriDate}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onToggleLanguage={handleToggleLanguage}
          onTestSound={handleTestSound}
        />

        {/* Tab Content Views */}
        <main className="flex-1 p-4 sm:p-5 space-y-5">
          {/* TAB 1: HOME (Next prayer hero + Today Dua + Sadqa Nudge) */}
          {currentTab === 'home' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Hero Next Prayer with Live Countdown */}
              <NextPrayerCard
                nextPrayer={prayerCalc.nextPrayer}
                currentPrayer={prayerCalc.currentPrayer}
                timeRemainingFormatted={prayerCalc.timeRemainingFormatted}
                progressPercentage={prayerCalc.progressPercentage}
                settings={settings}
                onToggleNotification={handleToggleNotification}
                onViewAllPrayers={() => setCurrentTab('prayers')}
              />

              {/* Today's Dua Card */}
              <DailyDuaCard
                dua={todayDua}
                language={settings.language}
                isRead={readDuaIds.includes(todayDua.id)}
                onToggleRead={handleToggleReadDua}
                onOpenLibrary={() => setIsDuaLibraryOpen(true)}
              />

              {/* Daily Sadqa Nudge & Quick Logger */}
              <SadqaNudgeCard
                reflection={todayReflection}
                language={settings.language}
                hasLoggedToday={hasLoggedSadqaToday}
                totalSadqaLogsCount={sadqaLogs.length}
                onLogSadqa={handleLogSadqa}
                onOpenGiveDirectory={() => setCurrentTab('give')}
              />
            </div>
          )}

          {/* TAB 2: PRAYERS (Full Prayer Times Table + Countdown + Adjustments) */}
          {currentTab === 'prayers' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <NextPrayerCard
                nextPrayer={prayerCalc.nextPrayer}
                currentPrayer={prayerCalc.currentPrayer}
                timeRemainingFormatted={prayerCalc.timeRemainingFormatted}
                progressPercentage={prayerCalc.progressPercentage}
                settings={settings}
                onToggleNotification={handleToggleNotification}
                onViewAllPrayers={() => {}}
              />

              <PrayerTimesList
                prayerItems={prayerCalc.items}
                settings={settings}
                city={city}
                onToggleNotification={handleToggleNotification}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
            </div>
          )}

          {/* TAB 3: DUAS (Authentic Duas Collection & Today's Dua) */}
          {currentTab === 'duas' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <DailyDuaCard
                dua={todayDua}
                language={settings.language}
                isRead={readDuaIds.includes(todayDua.id)}
                onToggleRead={handleToggleReadDua}
                onOpenLibrary={() => setIsDuaLibraryOpen(true)}
              />

              <div className="bg-white rounded-[32px] p-6 sm:p-7 border border-[#E8E6DF] shadow-xs text-center space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-[#2D3436]">
                  {isUrdu ? 'مسنون دعاؤں کا مکمل ذخیرہ' : 'Complete Daily Duas Library'}
                </h3>
                <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed max-w-md mx-auto">
                  {isUrdu
                    ? 'صبح و شام، نماز کے بعد، پریشانی اور شکر گزاری کی تمام مستند دعائیں ترجمے اور تلفظ کے ساتھ پڑھیں۔'
                    : 'Explore all categorized daily supplications for morning, evening, distress, gratitude and Salah.'}
                </p>
                <button
                  id="open-full-dua-lib-btn"
                  onClick={() => setIsDuaLibraryOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-[#2D5A27] hover:bg-[#23461e] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
                >
                  {isUrdu ? 'تمام دعائیں کھولیں' : 'Open Dua Library'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: GIVE (Verified Pakistan NGO Directory for Sadqa/Zakat) */}
          {currentTab === 'give' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <GiveDirectory
                language={settings.language}
                onLogDonation={() => handleLogSadqa('money')}
              />
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {currentTab === 'settings' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="bg-white rounded-[32px] p-6 sm:p-7 border border-[#E8E6DF] shadow-xs space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-[#2D3436]">
                  {isUrdu ? 'ایپ کی ترتیبات' : 'App Settings & Preferences'}
                </h3>
                <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
                  {isUrdu
                    ? 'شہر، اذان کی آواز، حساب کا طریقہ (جامعہ کراچی / رابطۃ العالم الاسلامی) اور فقہی مسلک تبدیل کریں۔'
                    : 'Customize your city location, Azan alert sounds, prayer calculation authority, and language.'}
                </p>
                <button
                  id="tab-open-settings-btn"
                  onClick={() => setIsSettingsOpen(true)}
                  className="w-full py-3.5 rounded-2xl bg-[#2D5A27] hover:bg-[#23461e] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
                >
                  {isUrdu ? 'ترتیبات کھولیں' : 'Open Settings Panel'}
                </button>
              </div>

              {/* Sadqa Progress Summary */}
              <div className="bg-white rounded-[32px] p-6 sm:p-7 border border-[#E8E6DF] shadow-xs space-y-4">
                <h4 className="text-base font-bold text-[#2D3436]">
                  {isUrdu ? 'صدقہ کا ذاتی ریکارڈ' : 'Your Personal Sadqa History'}
                </h4>
                <div className="flex items-center justify-between p-4 bg-[#F9F8F4] rounded-2xl border border-[#E8E6DF]">
                  <span className="text-xs font-semibold text-[#2D3436]">
                    {isUrdu ? 'کل لاگ کیے گئے صدقات' : 'Total Sadqa Days Logged'}
                  </span>
                  <span className="text-base font-bold text-[#2D5A27] font-mono">
                    {sadqaLogs.length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#F9F8F4] rounded-2xl border border-[#E8E6DF]">
                  <span className="text-xs font-semibold text-[#2D3436]">
                    {isUrdu ? 'آج کا صدقہ' : "Today's Status"}
                  </span>
                  <span className={`text-xs font-bold ${hasLoggedSadqaToday ? 'text-[#2D5A27]' : 'text-[#C5A059]'}`}>
                    {hasLoggedSadqaToday
                      ? isUrdu ? 'مکمل ہوا ✓' : 'Completed ✓'
                      : isUrdu ? 'باقی ہے' : 'Not yet logged'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Modals */}
        <DuaLibraryModal
          isOpen={isDuaLibraryOpen}
          onClose={() => setIsDuaLibraryOpen(false)}
          language={settings.language}
          readDuaIds={readDuaIds}
          onToggleRead={handleToggleReadDua}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
        />

        {/* Bottom Navigation */}
        <BottomNav
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          language={settings.language}
        />
      </div>
    </div>
  );
}
