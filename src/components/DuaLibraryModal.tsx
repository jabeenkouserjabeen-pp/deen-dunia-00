import React, { useState } from 'react';
import { X, Search, BookOpen, Volume2, Copy, Check, Filter, Heart } from 'lucide-react';
import { DAILY_DUAS } from '../data/duas';
import { DuaItem } from '../types';
import { audioService } from '../services/audioService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'ur';
  readDuaIds: string[];
  onToggleRead: (id: string) => void;
}

export const DuaLibraryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  language,
  readDuaIds,
  onToggleRead,
}) => {
  if (!isOpen) return null;

  const isUrdu = language === 'ur';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', labelEn: 'All Duas', labelUr: 'تمام دعائیں' },
    { id: 'morning_evening', labelEn: 'Morning & Evening', labelUr: 'صبح و شام' },
    { id: 'daily', labelEn: 'Daily Life', labelUr: 'روزمرہ کی دعائیں' },
    { id: 'distress', labelEn: 'Relief from Grief', labelUr: 'غم و پریشانی' },
    { id: 'prayer', labelEn: 'After Salah', labelUr: 'نماز و وضو' },
    { id: 'protection', labelEn: 'Protection', labelUr: 'حفاظت و عافیت' },
    { id: 'family', labelEn: 'Parents & Family', labelUr: 'والدین و اہل خانہ' },
  ];

  const filteredDuas = DAILY_DUAS.filter((dua) => {
    const matchesCat = selectedCat === 'all' || dua.category === selectedCat;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      dua.titleEn.toLowerCase().includes(query) ||
      dua.titleUr.includes(query) ||
      dua.arabic.includes(query) ||
      dua.transliteration.toLowerCase().includes(query) ||
      dua.translationEn.toLowerCase().includes(query) ||
      dua.translationUr.includes(query);
    return matchesCat && matchesSearch;
  });

  const handleCopy = (dua: DuaItem) => {
    const text = `${dua.arabic}\n\n${dua.transliteration}\n\nEnglish: ${dua.translationEn}\n\nاردو: ${dua.translationUr}\n\n[${dua.reference}]`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      id="dua-library-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-xl max-h-[90vh] bg-[#F9F8F4] rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-[#E8E6DF]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#E8E6DF] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2D5A27] text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#2D3436]">
                {isUrdu ? 'مسنون دعاؤں کا ذخیرہ' : 'Daily Duas & Supplications'}
              </h2>
              <p className="text-xs text-[#4A4A4A]">
                {isUrdu ? 'صحیح احادیث و قرآن کی مستند دعائیں' : 'Authentic Sunnah & Quranic Duas'}
              </p>
            </div>
          </div>

          <button
            id="close-dua-library-btn"
            onClick={onClose}
            aria-label="Close Dua Library"
            className="p-2 rounded-full text-stone-400 hover:text-[#2D3436] hover:bg-[#F9F8F4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter / Search section */}
        <div className="p-4 bg-white border-b border-[#E8E6DF] space-y-2.5">
          <div className="relative">
            <Search className={`w-4 h-4 text-stone-400 absolute top-1/2 -translate-y-1/2 ${isUrdu ? 'right-3.5' : 'left-3.5'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isUrdu ? 'دعا تلاش کریں...' : 'Search supplications...'}
              className={`w-full bg-[#F9F8F4] rounded-2xl border border-[#E8E6DF] py-2.5 text-xs sm:text-sm text-[#2D3436] focus:outline-hidden focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/20 ${
                isUrdu ? 'pr-10 pl-3' : 'pl-10 pr-3'
              }`}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCat(c.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  selectedCat === c.id
                    ? 'bg-[#2D5A27] text-white shadow-xs'
                    : 'bg-[#F9F8F4] text-[#2D3436] hover:bg-[#E8E6DF] border border-[#E8E6DF]'
                }`}
              >
                {isUrdu ? c.labelUr : c.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Duas List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredDuas.map((dua) => {
            const isRead = readDuaIds.includes(dua.id);

            return (
              <div
                key={dua.id}
                id={`dua-item-${dua.id}`}
                className="bg-white rounded-[24px] p-5 border border-[#E8E6DF] shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#2D3436]">
                    {isUrdu ? dua.titleUr : dua.titleEn}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0" dir="ltr">
                    <button
                      onClick={() => audioService.playGentleChime()}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-[#2D5A27] hover:bg-[#F9F8F4]"
                      title="Play serene chime"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopy(dua)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-[#2D5A27] hover:bg-[#F9F8F4]"
                      title="Copy"
                    >
                      {copiedId === dua.id ? (
                        <Check className="w-4 h-4 text-[#2D5A27]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Arabic Script */}
                <div className="bg-[#FFF9EA] rounded-2xl p-4 border border-[#F3E5C2] text-center">
                  <p className="font-arabic text-xl sm:text-2xl text-[#2D3436] leading-loose" dir="rtl">
                    {dua.arabic}
                  </p>
                </div>

                {/* Pronunciation */}
                <p className="text-xs text-[#4A4A4A] italic" dir="ltr">
                  {dua.transliteration}
                </p>

                {/* Urdu & English */}
                <div className="space-y-2 text-xs">
                  <p className="text-[#2D3436] font-arabic bg-[#F9F8F4] p-3 rounded-xl border border-[#E8E6DF]" dir="rtl">
                    <span className="font-bold text-[#C5A059] ml-1">ترجمہ:</span> {dua.translationUr}
                  </p>
                  <p className="text-[#4A4A4A] bg-[#F9F8F4] p-3 rounded-xl border border-[#E8E6DF]" dir="ltr">
                    <span className="font-semibold text-[#2D3436] mr-1">English:</span> {dua.translationEn}
                  </p>
                </div>

                {/* Footer Reference */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E8E6DF] text-[11px] text-[#4A4A4A]">
                  <span>📖 {dua.reference}</span>
                  <button
                    onClick={() => onToggleRead(dua.id)}
                    className={`px-3 py-1 rounded-full font-bold text-xs transition-colors ${
                      isRead
                        ? 'bg-[#2D5A27] text-white'
                        : 'bg-[#F9F8F4] text-[#2D5A27] border border-[#2D5A27]/30 hover:bg-[#2D5A27]/10'
                    }`}
                  >
                    {isRead ? (isUrdu ? 'پڑھ لیا ✓' : 'Read ✓') : (isUrdu ? 'پڑھیں' : 'Mark as Read')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
