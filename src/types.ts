export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export type CalculationMethodKey = 'Karachi' | 'MuslimWorldLeague' | 'ISNA' | 'UmmAlQura' | 'Egyptian' | 'Dubai' | 'Kuwait' | 'Qatar' | 'Singapore' | 'Tehran' | 'NorthAmerica';

export type JuristicMethod = 'Hanafi' | 'Shafi';

export interface CityLocation {
  id: string;
  nameEn: string;
  nameUr: string;
  province?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface PrayerTimeItem {
  id: PrayerName;
  nameEn: string;
  nameUr: string;
  arabicName: string;
  time: Date;
  formattedTime: string;
  isNext: boolean;
  isCurrent: boolean;
  hasPassed: boolean;
  notificationEnabled: boolean;
}

export interface HijriDate {
  day: number;
  monthNameEn: string;
  monthNameUr: string;
  monthNameAr: string;
  year: number;
  formattedEn: string;
  formattedUr: string;
}

export interface AppSettings {
  language: 'en' | 'ur';
  useGPS: boolean;
  selectedCityId: string;
  customCoordinates?: {
    latitude: number;
    longitude: number;
    name: string;
  };
  calculationMethod: CalculationMethodKey;
  juristicMethod: JuristicMethod;
  timeFormat24h: boolean;
  prayerNotifications: Record<PrayerName, boolean>;
  reminder10MinBefore: boolean;
  sadqaReminderEnabled: boolean;
  sadqaReminderTime: string; // e.g. "09:00"
  soundType: 'takbeer' | 'beep' | 'gentle' | 'silent';
  manualTimeAdjustmentMinutes: Record<PrayerName, number>;
}

export interface DuaItem {
  id: string;
  titleEn: string;
  titleUr: string;
  category: 'daily' | 'morning_evening' | 'prayer' | 'forgiveness' | 'protection' | 'gratitude' | 'distress' | 'family';
  arabic: string;
  transliteration: string;
  translationEn: string;
  translationUr: string;
  reference: string;
  benefit?: string;
  benefitUr?: string;
}

export interface NgoItem {
  id: string;
  nameEn: string;
  nameUr: string;
  category: 'emergency' | 'healthcare' | 'education' | 'food' | 'orphans' | 'microfinance' | 'water';
  categoryLabelEn: string;
  categoryLabelUr: string;
  shortDescEn: string;
  shortDescUr: string;
  fullDescEn: string;
  fullDescUr: string;
  websiteUrl: string;
  donationUrl: string;
  whatsAppNumber?: string;
  phone?: string;
  paymentMethods: {
    jazzCash?: string;
    easyPaisa?: string;
    bankAccount?: string;
    iban?: string;
    onlinePortal?: boolean;
  };
  verified: boolean;
  highlightedCauseEn: string;
  highlightedCauseUr: string;
}

export interface SadqaLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  type: 'money' | 'food' | 'kindness' | 'clothes' | 'help' | 'other';
  note?: string;
}

export interface DailyReflection {
  id: string;
  quoteEn: string;
  quoteUr: string;
  sourceEn: string;
  sourceUr: string;
  type: 'hadith' | 'quran';
}
