import { DailyReflection } from '../types';

export const SADQA_REFLECTIONS: DailyReflection[] = [
  {
    id: 'sadqa-1',
    quoteEn: '“Charity (Sadqa) does not decrease wealth, no one forgives another except that Allah increases his honor, and no one humbles himself for the sake of Allah except that Allah raises his status.”',
    quoteUr: '”صدقہ کرنے سے مال میں کمی نہیں آتی، معاف کرنے سے اللہ عزت میں اضافہ فرماتا ہے، اور جو اللہ کے لیے عاجزی اختیار کرے اللہ اس کا درجہ بلند فرماتا ہے۔“',
    sourceEn: 'Sahih Muslim 2588',
    sourceUr: 'صحیح مسلم: 2588',
    type: 'hadith',
  },
  {
    id: 'sadqa-2',
    quoteEn: '“Charity (Sadqa) extinguishes sin just as water extinguishes fire.”',
    quoteUr: '”صدقہ گناہوں کو اس طرح بجھا دیتا ہے جس طرح پانی آگ کو بجھا دیتا ہے۔“',
    sourceEn: 'Jami` at-Tirmidhi 614 (Sahih)',
    sourceUr: 'جامع ترمذی: 614',
    type: 'hadith',
  },
  {
    id: 'sadqa-3',
    quoteEn: '“Your smile for your brother is charity. Commanding good and forbidding evil is charity. Guiding someone who is lost is charity, and removing stones, thorns, and bones from the path is charity.”',
    quoteUr: '”تمہارا اپنے مسلمان بھائی کے سامنے مسکرانا صدقہ ہے، نیکی کا حکم دینا اور برائی سے روکنا صدقہ ہے، راستہ بھولے ہوئے کو راستہ دکھانا صدقہ ہے، اور راستے سے پتھر یا کانٹا ہٹانا صدقہ ہے۔“',
    sourceEn: 'Jami` at-Tirmidhi 1956 (Hasan)',
    sourceUr: 'جامع ترمذی: 1956',
    type: 'hadith',
  },
  {
    id: 'sadqa-4',
    quoteEn: '“Protect yourselves from the Hellfire, even if by giving half a date in charity.”',
    quoteUr: '”جہنم کی آگ سے بچو خواہ کھجور کے ایک ٹکڑے کا صدقہ کر کے ہی کیوں نہ ہو۔“',
    sourceEn: 'Sahih al-Bukhari 1417',
    sourceUr: 'صحیح بخاری: 1417',
    type: 'hadith',
  },
  {
    id: 'sadqa-5',
    quoteEn: '“Every person will be in the shade of their charity on the Day of Judgment until people are judged.”',
    quoteUr: '”قیامت کے دن ہر شخص اپنے صدقے کے سائے میں ہوگا، یہاں تک کہ لوگوں کے درمیان فیصلہ کر دیا جائے۔“',
    sourceEn: 'Musnad Ahmad 17333 (Sahih)',
    sourceUr: 'مسند احمد: 17333',
    type: 'hadith',
  },
  {
    id: 'sadqa-6',
    quoteEn: '“The believer’s shade on the Day of Resurrection will be their charity.”',
    quoteUr: '”قیامت کے دن مومن کا سایہ اس کا صدقہ ہوگا۔“',
    sourceEn: 'Sunan al-Tirmidhi 604 (Sahih)',
    sourceUr: 'سنن ترمذی: 604',
    type: 'hadith',
  },
  {
    id: 'sadqa-7',
    quoteEn: '“Those who spend their wealth in the cause of Allah is like a seed of grain which grows seven spikes; in each spike is a hundred grains. And Allah multiplies for whom He wills.”',
    quoteUr: '”جو لوگ اپنے مال اللہ کی راہ میں خرچ کرتے ہیں ان کی مثال اس دانے جیسی ہے جس سے سات بالیاں اگیں اور ہر بالی میں سو دانے ہوں، اور اللہ جس کے لیے چاہتا ہے اس میں کئی گنا اضافہ فرما دیتا ہے۔“',
    sourceEn: 'Surah Al-Baqarah 2:261',
    sourceUr: 'سورۃ البقرۃ: 261',
    type: 'quran',
  },
];

export function getTodayReflection(): DailyReflection {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const index = dayOfYear % SADQA_REFLECTIONS.length;
  return SADQA_REFLECTIONS[index];
}
