import React, { useState } from 'react';
import { Volume2, Copy, Check, BookOpen, Share2, Sparkles, ChevronRight, Bookmark } from 'lucide-react';
import { DuaItem } from '../types';
import { audioService } from '../services/audioService';

interface Props {
  dua: DuaItem;
  language: 'en' | 'ur';
  isRead: boolean;
  onToggleRead: (duaId: string) => void;
  onOpenLibrary: () => void;
}

export const DailyDuaCard: React.FC<Props> = ({
  dua,
  language,
  isRead,
  onToggleRead,
  onOpenLibrary,
}) => {
  const isUrdu = language === 'ur';
  const [copied, setCopied] = useState(false);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [arabicFontSize, setArabicFontSize] = useState<'normal' | 'large'>('large');

  const handleCopy = () => {
    const textToCopy = `${dua.arabic}\n\nTransliteration: ${dua.transliteration}\n\nTranslation: ${dua.translationEn}\n\nاردو ترجمہ: ${dua.translationUr}\n\nSource: ${dua.reference} — via Daily Deen App`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlayTone = () => {
    audioService.playGentleChime();
  };

  return (
    <div
      id="daily-dua-card"
      className="bg-[#FFF9EA] border border-[#F3E5C2] rounded-[32px] p-6 sm:p-8 flex flex-col shadow-xs transition-all"
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      {/* Top Bar: Category Tag & Icon from Geometric Balance theme */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-2 border-b border-[#F3E5C2]">
        <div className="flex items-center gap-2">
          <span className="bg-[#C5A059]/15 text-[#C5A059] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-[#C5A059]/20">
            {isUrdu ? 'آج کی مسنون دعا' : 'Daily Dua'}
          </span>
          <span className="text-xs font-semibold text-[#2D3436] hidden sm:inline">
            {isUrdu ? dua.titleUr : dua.titleEn}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 shrink-0" dir="ltr">
          <button
            id="dua-play-sound-btn"
            onClick={handlePlayTone}
            title={isUrdu ? 'تلاوت و سکون سنیں' : 'Play peaceful chime tone'}
            className="p-2 rounded-full text-[#C5A059] hover:bg-[#C5A059]/10 transition-colors"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            id="dua-copy-btn"
            onClick={handleCopy}
            title={isUrdu ? 'دعا کاپی کریں' : 'Copy Dua'}
            className="p-2 rounded-full text-[#C5A059] hover:bg-[#C5A059]/10 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-[#2D5A27]" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Arabic Script Section */}
      <div className="my-3 text-center sm:text-right relative">
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setArabicFontSize(f => f === 'normal' ? 'large' : 'normal')}
            className="text-[10px] font-mono px-2 py-0.5 bg-white/80 rounded-md border border-[#F3E5C2] text-[#C5A059] hover:bg-white"
            title="Toggle Arabic Font Size"
          >
            {arabicFontSize === 'large' ? 'A-' : 'A+'}
          </button>
        </div>

        <p
          className={`font-arabic text-[#2D3436] leading-loose sm:leading-loose text-center sm:text-right ${
            arabicFontSize === 'large' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
          }`}
          dir="rtl"
        >
          {dua.arabic}
        </p>
      </div>

      {/* Transliteration */}
      {showTransliteration && (
        <div className="my-2">
          <p className="text-xs sm:text-sm text-[#4A4A4A] italic leading-relaxed" dir="ltr">
            <span className="font-semibold text-stone-500 not-italic">Pronunciation: </span>
            {dua.transliteration}
          </p>
        </div>
      )}

      {/* Translations (Both Urdu and English) */}
      <div className="space-y-2 mt-3 pt-3 border-t border-[#F3E5C2]">
        {/* Urdu Translation */}
        <div className="bg-white/70 p-3.5 rounded-2xl border border-[#F3E5C2]" dir="rtl">
          <span className="text-[11px] font-bold text-[#C5A059] block mb-0.5">اردو ترجمہ:</span>
          <p className="text-sm font-arabic text-[#2D3436] leading-relaxed">
            {dua.translationUr}
          </p>
        </div>

        {/* English Translation */}
        <div className="bg-white/70 p-3.5 rounded-2xl border border-[#F3E5C2]" dir="ltr">
          <span className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider block mb-0.5">
            English Meaning:
          </span>
          <p className="text-sm italic text-[#4A4A4A] leading-snug">
            "{dua.translationEn}"
          </p>
        </div>
      </div>

      {/* Reference & Recited Action */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-[#4A4A4A] bg-white/80 px-3 py-1.5 rounded-full border border-[#F3E5C2]">
          📖 {dua.reference}
        </span>

        {/* Mark read button */}
        <button
          id={`toggle-read-dua-${dua.id}`}
          onClick={() => onToggleRead(dua.id)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold text-xs transition-all ${
            isRead
              ? 'bg-[#2D5A27] text-white shadow-xs'
              : 'bg-white text-[#2D5A27] border border-[#2D5A27]/30 hover:bg-[#2D5A27]/10'
          }`}
        >
          <Check className={`w-3.5 h-3.5 ${isRead ? 'stroke-[3]' : ''}`} />
          <span>
            {isRead
              ? isUrdu
                ? 'آج پڑھ لیا ✓'
                : 'Recited Today ✓'
              : isUrdu
                ? 'آج پڑھ لیا؟'
                : 'Mark as Recited'}
          </span>
        </button>
      </div>

      {/* Footer link to browse more duas */}
      <div className="mt-4 pt-3 border-t border-[#F3E5C2] flex items-center justify-between">
        <span className="text-xs text-[#4A4A4A]/80 font-medium">
          {isUrdu ? '12+ مسنون دعاؤں کا ذخیرہ' : '12+ Authentic Sunnah Duas'}
        </span>
        <button
          id="browse-more-duas-btn"
          onClick={onOpenLibrary}
          className="flex items-center gap-1 text-xs font-bold text-[#2D5A27] hover:text-[#1e3e1a] transition-colors"
        >
          <span>{isUrdu ? 'تمام دعائیں کھولیں' : 'Explore All Duas'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

