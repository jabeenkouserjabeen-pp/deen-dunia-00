import { AppSettings, PrayerTimeItem } from '../types';
import { audioService } from './audioService';

export interface InAppAlert {
  id: string;
  title: string;
  body: string;
  time: string;
  type: 'prayer' | 'reminder' | 'sadqa';
}

type AlertCallback = (alert: InAppAlert) => void;

class NotificationService {
  private alertListeners: Set<AlertCallback> = new Set();
  private lastAlertedMinute: string = '';

  addListener(cb: AlertCallback): () => void {
    this.alertListeners.add(cb);
    return () => this.alertListeners.delete(cb);
  }

  notify(alert: InAppAlert, settings: AppSettings): void {
    // 1. Play selected audio
    audioService.playByType(settings.soundType);

    // 2. Notify in-app UI listeners
    this.alertListeners.forEach(listener => listener(alert));

    // 3. Trigger Browser Web Notification if permission granted
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification(alert.title, {
            body: alert.body,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
          });
        } catch (e) {
          // Some environments don't allow new Notification in iframe
        }
      }
    }
  }

  async requestPermission(): Promise<NotificationPermission | 'unsupported'> {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        return res;
      } catch (e) {
        return 'denied';
      }
    }
    return 'unsupported';
  }

  getPermissionState(): NotificationPermission | 'unsupported' {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  }

  /**
   * Periodic check (called every 15s) against prayer times to fire alerts
   */
  checkAndTriggerAlerts(
    prayerItems: PrayerTimeItem[],
    settings: AppSettings
  ): void {
    const now = new Date();
    const currentMinuteKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}:${now.getMinutes()}`;

    if (this.lastAlertedMinute === currentMinuteKey) {
      return;
    }

    const nowTime = now.getTime();

    for (const item of prayerItems) {
      if (item.id === 'sunrise') continue; // Don't notify for sunrise prayer

      // Check if notification enabled for this prayer
      const isEnabled = settings.prayerNotifications[item.id];
      if (!isEnabled) continue;

      const prayerTime = item.time.getTime();
      const diffSeconds = (nowTime - prayerTime) / 1000;

      // 1. Exact Prayer Time Alert (within 45s window)
      if (diffSeconds >= -5 && diffSeconds <= 45) {
        this.lastAlertedMinute = currentMinuteKey;
        const isUrdu = settings.language === 'ur';
        this.notify({
          id: `exact-${item.id}-${Date.now()}`,
          title: isUrdu ? `${item.nameUr} کا وقت ہو گیا ہے` : `Time for ${item.nameEn} Prayer`,
          body: isUrdu
            ? `حی علی الصلاۃ — ${item.nameUr} کی نماز ادا فرمائیں۔`
            : `Hayya 'ala-s-Salah. It is now time to perform ${item.nameEn} prayer.`,
          time: item.formattedTime,
          type: 'prayer',
        }, settings);
        break;
      }

      // 2. 10 Minutes Before Reminder
      if (settings.reminder10MinBefore) {
        const diffBeforeSec = (prayerTime - nowTime) / 1000;
        if (diffBeforeSec >= 540 && diffBeforeSec <= 600) { // ~9-10 mins before
          this.lastAlertedMinute = currentMinuteKey;
          const isUrdu = settings.language === 'ur';
          this.notify({
            id: `before-${item.id}-${Date.now()}`,
            title: isUrdu ? `10 منٹ بعد ${item.nameUr} کا وقت` : `${item.nameEn} in 10 minutes`,
            body: isUrdu
              ? `وضو فرمائیں اور ${item.nameUr} کی تیاری کریں۔`
              : `Prepare your wudu for ${item.nameEn} prayer (${item.formattedTime}).`,
            time: item.formattedTime,
            type: 'reminder',
          }, settings);
          break;
        }
      }
    }
  }
}

export const notificationService = new NotificationService();
