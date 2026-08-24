import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan';
import { AppSettings, CityLocation, HijriDate, PrayerName, PrayerTimeItem } from '../types';
import { ALL_CITIES, DEFAULT_CITY } from '../data/cities';

export const prayerService = {
  getCityLocation(settings: AppSettings): CityLocation {
    if (settings.useGPS && settings.customCoordinates) {
      return {
        id: 'gps',
        nameEn: settings.customCoordinates.name || 'Current GPS Location',
        nameUr: settings.customCoordinates.name || 'موجودہ مقام (جی پی ایس)',
        country: 'Pakistan',
        latitude: settings.customCoordinates.latitude,
        longitude: settings.customCoordinates.longitude,
        timezone: 'Asia/Karachi',
      };
    }
    const found = ALL_CITIES.find(c => c.id === settings.selectedCityId);
    return found || DEFAULT_CITY;
  },

  getCalculationParameters(settings: AppSettings) {
    let params;
    switch (settings.calculationMethod) {
      case 'Karachi':
        params = CalculationMethod.Karachi();
        break;
      case 'MuslimWorldLeague':
        params = CalculationMethod.MuslimWorldLeague();
        break;
      case 'ISNA':
      case 'NorthAmerica':
        params = CalculationMethod.NorthAmerica();
        break;
      case 'UmmAlQura':
        params = CalculationMethod.UmmAlQura();
        break;
      case 'Egyptian':
        params = CalculationMethod.Egyptian();
        break;
      case 'Dubai':
        params = CalculationMethod.Dubai();
        break;
      case 'Qatar':
        params = CalculationMethod.Qatar();
        break;
      case 'Kuwait':
        params = CalculationMethod.Kuwait();
        break;
      case 'Singapore':
        params = CalculationMethod.Singapore();
        break;
      case 'Tehran':
        params = CalculationMethod.Tehran();
        break;
      default:
        params = CalculationMethod.Karachi();
    }

    if (settings.juristicMethod === 'Hanafi') {
      params.madhab = Madhab.Hanafi;
    } else {
      params.madhab = Madhab.Shafi;
    }

    return params;
  },

  formatTime(date: Date, format24h: boolean): string {
    if (!date || isNaN(date.getTime())) return '--:--';
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: !format24h,
    });
  },

  calculateTodayPrayers(settings: AppSettings, targetDate: Date = new Date()): {
    items: PrayerTimeItem[];
    nextPrayer: PrayerTimeItem | null;
    currentPrayer: PrayerTimeItem | null;
    timeRemainingFormatted: string;
    progressPercentage: number;
    rawPrayerTimes: PrayerTimes;
  } {
    const city = this.getCityLocation(settings);
    const coordinates = new Coordinates(city.latitude, city.longitude);
    const params = this.getCalculationParameters(settings);
    const prayerTimes = new PrayerTimes(coordinates, targetDate, params);

    // Apply manual adjustment minutes if any
    const adjust = (date: Date, mins: number) => new Date(date.getTime() + mins * 60 * 1000);

    const fajrTime = adjust(prayerTimes.fajr, settings.manualTimeAdjustmentMinutes?.fajr || 0);
    const sunriseTime = adjust(prayerTimes.sunrise, settings.manualTimeAdjustmentMinutes?.sunrise || 0);
    const dhuhrTime = adjust(prayerTimes.dhuhr, settings.manualTimeAdjustmentMinutes?.dhuhr || 0);
    const asrTime = adjust(prayerTimes.asr, settings.manualTimeAdjustmentMinutes?.asr || 0);
    const maghribTime = adjust(prayerTimes.maghrib, settings.manualTimeAdjustmentMinutes?.maghrib || 0);
    const ishaTime = adjust(prayerTimes.isha, settings.manualTimeAdjustmentMinutes?.isha || 0);

    const now = new Date();
    const nowTime = now.getTime();

    // Map prayer items
    const rawList: { id: PrayerName; nameEn: string; nameUr: string; arabicName: string; time: Date }[] = [
      { id: 'fajr', nameEn: 'Fajr', nameUr: 'فجر', arabicName: 'الفجر', time: fajrTime },
      { id: 'sunrise', nameEn: 'Sunrise', nameUr: 'طلوع آفتاب', arabicName: 'الشروق', time: sunriseTime },
      { id: 'dhuhr', nameEn: 'Dhuhr', nameUr: 'ظہر', arabicName: 'الظهر', time: dhuhrTime },
      { id: 'asr', nameEn: 'Asr', nameUr: 'عصر', arabicName: 'العصر', time: asrTime },
      { id: 'maghrib', nameEn: 'Maghrib', nameUr: 'مغرب', arabicName: 'المغرب', time: maghribTime },
      { id: 'isha', nameEn: 'Isha', nameUr: 'عشاء', arabicName: 'العشاء', time: ishaTime },
    ];

    // Determine current & next prayer
    // Filter out sunrise for primary prayer sequence, but keep it in the list
    const actualPrayersOnly = rawList.filter(p => p.id !== 'sunrise');
    
    let currentPrayerItem: PrayerTimeItem | null = null;
    let nextPrayerItem: PrayerTimeItem | null = null;

    // Find next prayer today
    const upcoming = actualPrayersOnly.find(p => p.time.getTime() > nowTime);
    
    if (upcoming) {
      nextPrayerItem = {
        ...upcoming,
        formattedTime: this.formatTime(upcoming.time, settings.timeFormat24h),
        isNext: true,
        isCurrent: false,
        hasPassed: false,
        notificationEnabled: settings.prayerNotifications[upcoming.id] ?? true,
      };

      // The current prayer is the one just before
      const currentIndex = actualPrayersOnly.findIndex(p => p.id === upcoming.id) - 1;
      if (currentIndex >= 0) {
        const cur = actualPrayersOnly[currentIndex];
        currentPrayerItem = {
          ...cur,
          formattedTime: this.formatTime(cur.time, settings.timeFormat24h),
          isNext: false,
          isCurrent: true,
          hasPassed: true,
          notificationEnabled: settings.prayerNotifications[cur.id] ?? true,
        };
      } else {
        // Before Fajr today -> Current prayer is previous night's Isha
        const isha = actualPrayersOnly[actualPrayersOnly.length - 1];
        currentPrayerItem = {
          ...isha,
          formattedTime: this.formatTime(isha.time, settings.timeFormat24h),
          isNext: false,
          isCurrent: true,
          hasPassed: false,
          notificationEnabled: settings.prayerNotifications[isha.id] ?? true,
        };
      }
    } else {
      // After Isha today -> Next is tomorrow's Fajr
      const tomorrow = new Date(targetDate);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowPrayers = new PrayerTimes(coordinates, tomorrow, params);
      const tomorrowFajr = adjust(tomorrowPrayers.fajr, settings.manualTimeAdjustmentMinutes?.fajr || 0);

      nextPrayerItem = {
        id: 'fajr',
        nameEn: 'Fajr (Tomorrow)',
        nameUr: 'فجر (کل)',
        arabicName: 'الفجر',
        time: tomorrowFajr,
        formattedTime: this.formatTime(tomorrowFajr, settings.timeFormat24h),
        isNext: true,
        isCurrent: false,
        hasPassed: false,
        notificationEnabled: settings.prayerNotifications.fajr ?? true,
      };

      const isha = actualPrayersOnly[actualPrayersOnly.length - 1];
      currentPrayerItem = {
        ...isha,
        formattedTime: this.formatTime(isha.time, settings.timeFormat24h),
        isNext: false,
        isCurrent: true,
        hasPassed: true,
        notificationEnabled: settings.prayerNotifications[isha.id] ?? true,
      };
    }

    // Map all items
    const items: PrayerTimeItem[] = rawList.map(p => {
      const isNext = nextPrayerItem?.id === p.id && (!nextPrayerItem.nameEn.includes('Tomorrow') || p.id === 'fajr');
      const isCurrent = currentPrayerItem?.id === p.id;
      const hasPassed = p.time.getTime() <= nowTime;

      return {
        ...p,
        formattedTime: this.formatTime(p.time, settings.timeFormat24h),
        isNext,
        isCurrent,
        hasPassed,
        notificationEnabled: settings.prayerNotifications[p.id] ?? false,
      };
    });

    // Time countdown calculation
    let timeRemainingFormatted = '00:00:00';
    let progressPercentage = 0;

    if (nextPrayerItem) {
      const diffMs = Math.max(0, nextPrayerItem.time.getTime() - nowTime);
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      timeRemainingFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      // Progress percentage within current prayer window
      if (currentPrayerItem) {
        let startTime = currentPrayerItem.time.getTime();
        let endTime = nextPrayerItem.time.getTime();
        if (startTime > endTime) {
          // Wrap around day
          startTime -= 24 * 60 * 60 * 1000;
        }
        const totalDuration = endTime - startTime;
        const elapsed = nowTime - startTime;
        if (totalDuration > 0) {
          progressPercentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
        }
      }
    }

    return {
      items,
      nextPrayer: nextPrayerItem,
      currentPrayer: currentPrayerItem,
      timeRemainingFormatted,
      progressPercentage,
      rawPrayerTimes: prayerTimes,
    };
  },

  getHijriDate(date: Date = new Date()): HijriDate {
    const islamicMonthsEn = [
      'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
      'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
      'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah'
    ];

    const islamicMonthsUr = [
      'محرم الحرام', 'صفر المظفر', 'ربیع الاول', 'ربیع الثانی',
      'جمادی الاول', 'جمادی الثانی', 'رجب المرجب', 'شعبان المعظم',
      'رمضان المبارک', 'شوال المکرم', 'ذی القعدہ', 'ذی الحجہ'
    ];

    const islamicMonthsAr = [
      'المحرّم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
      'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
      'رمضان', 'شوّال', 'ذو القعدة', 'ذو الحجة'
    ];

    try {
      // Use Intl if supported
      const formatter = new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      });
      const parts = formatter.formatToParts(date);
      const day = parseInt(parts.find(p => p.type === 'day')?.value || '1', 10);
      const monthIdx = parseInt(parts.find(p => p.type === 'month')?.value || '1', 10) - 1;
      const year = parseInt(parts.find(p => p.type === 'year')?.value || '1448', 10);

      const mEn = islamicMonthsEn[monthIdx] || 'Safar';
      const mUr = islamicMonthsUr[monthIdx] || 'صفر المظفر';
      const mAr = islamicMonthsAr[monthIdx] || 'صفر';

      return {
        day,
        monthNameEn: mEn,
        monthNameUr: mUr,
        monthNameAr: mAr,
        year,
        formattedEn: `${day} ${mEn}, ${year} AH`,
        formattedUr: `${day} ${mUr} ${year}ھ`,
      };
    } catch (e) {
      // Fallback
      return {
        day: 10,
        monthNameEn: 'Safar',
        monthNameUr: 'صفر المظفر',
        monthNameAr: 'صفر',
        year: 1448,
        formattedEn: '10 Safar, 1448 AH',
        formattedUr: '10 صفر المظفر 1448ھ',
      };
    }
  },
};
