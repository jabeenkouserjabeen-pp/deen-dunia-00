import { AppSettings, SadqaLogEntry } from '../types';
import { DEFAULT_CITY } from '../data/cities';

const STORAGE_KEYS = {
  SETTINGS: 'daily_deen_settings_v1',
  SADQA_LOGS: 'daily_deen_sadqa_logs_v1',
  READ_DUAS: 'daily_deen_read_duas_v1',
  FAVORITE_DUAS: 'daily_deen_fav_duas_v1',
};

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  useGPS: false,
  selectedCityId: 'karachi',
  calculationMethod: 'Karachi',
  juristicMethod: 'Hanafi', // Default in Pakistan
  timeFormat24h: false,
  prayerNotifications: {
    fajr: true,
    sunrise: false,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  },
  reminder10MinBefore: true,
  sadqaReminderEnabled: true,
  sadqaReminderTime: '09:00',
  soundType: 'gentle',
  manualTimeAdjustmentMinutes: {
    fajr: 0,
    sunrise: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
  },
};

export const storageService = {
  getSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to parse settings from storage:', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  },

  getSadqaLogs(): SadqaLogEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SADQA_LOGS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to get sadqa logs:', e);
    }
    return [];
  },

  addSadqaLog(entry: Omit<SadqaLogEntry, 'id' | 'timestamp'>): SadqaLogEntry[] {
    try {
      const current = this.getSadqaLogs();
      const newEntry: SadqaLogEntry = {
        ...entry,
        id: `sadqa-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        timestamp: Date.now(),
      };
      // Keep only one entry per date for clean streak or append
      const updated = [newEntry, ...current];
      localStorage.setItem(STORAGE_KEYS.SADQA_LOGS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Failed to add sadqa log:', e);
      return [];
    }
  },

  hasLoggedSadqaToday(): boolean {
    const today = new Date().toISOString().split('T')[0];
    const logs = this.getSadqaLogs();
    return logs.some(log => log.date === today);
  },

  getReadDuaIds(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.READ_DUAS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return [];
  },

  toggleReadDua(duaId: string): boolean {
    try {
      const current = this.getReadDuaIds();
      let updated: string[];
      let isRead = false;
      if (current.includes(duaId)) {
        updated = current.filter(id => id !== duaId);
        isRead = false;
      } else {
        updated = [...current, duaId];
        isRead = true;
      }
      localStorage.setItem(STORAGE_KEYS.READ_DUAS, JSON.stringify(updated));
      return isRead;
    } catch (e) {
      return false;
    }
  },

  getFavoriteDuaIds(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAVORITE_DUAS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return [];
  },

  toggleFavoriteDua(duaId: string): boolean {
    try {
      const current = this.getFavoriteDuaIds();
      let updated: string[];
      let isFav = false;
      if (current.includes(duaId)) {
        updated = current.filter(id => id !== duaId);
        isFav = false;
      } else {
        updated = [...current, duaId];
        isFav = true;
      }
      localStorage.setItem(STORAGE_KEYS.FAVORITE_DUAS, JSON.stringify(updated));
      return isFav;
    } catch (e) {
      return false;
    }
  },
};
