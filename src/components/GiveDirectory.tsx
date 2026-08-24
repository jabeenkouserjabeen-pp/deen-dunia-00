import React, { useState } from 'react';
import {
  ExternalLink,
  CheckCircle2,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Search,
  Filter,
  ShieldCheck,
  Heart,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { NGO_DIRECTORY } from '../data/ngos';
import { NgoItem } from '../types';

interface Props {
  language: 'en' | 'ur';
  onLogDonation?: () => void;
}

export const GiveDirectory: React.FC<Props> = ({ language, onLogDonation }) => {
  const isUrdu = language === 'ur';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedNgoId, setExpandedNgoId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const categories = [
    { id: 'all', labelEn: 'All Causes', labelUr: 'تمام شعبہ جات' },
    { id: 'food', labelEn: 'Food & Dastarkhwan', labelUr: 'راشن و کھانا' },
    { id: 'healthcare', labelEn: 'Free Hospitals', labelUr: 'مفت علاج و ہسپتال' },
    { id: 'education', labelEn: 'Education', labelUr: 'تعلیم و سکول' },
    { id: 'emergency', labelEn: 'Emergency & Orphans', labelUr: 'ہنگامی امداد و یتیم' },
    { id: 'microfinance', labelEn: 'Interest-Free Loans', labelUr: 'بلا سود قرضے' },
  ];

  const filteredNgos = NGO_DIRECTORY.filter((ngo) => {
    const matchesCategory =
      selectedCategory === 'all' || ngo.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      ngo.nameEn.toLowerCase().includes(query) ||
      ngo.nameUr.includes(query) ||
      ngo.shortDescEn.toLowerCase().includes(query) ||
      ngo.shortDescUr.includes(query) ||
      ngo.categoryLabelEn.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDonateClick = (ngo: NgoItem) => {
    // Open external official NGO link safely
    window.open(ngo.donationUrl, '_blank', 'noopener,noreferrer');
    if (onLogDonation) {
      onLogDonation();
    }
  };

  const handleWhatsAppClick = (ngo: NgoItem) => {
    if (!ngo.whatsAppNumber) return;
    const cleanNum = ngo.whatsAppNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Assalam-o-Alaikum. I would like to inquire about donating Sadqa / Zakat to ${ngo.nameEn}.`
    );
    window.open(`https://wa.me/${cleanNum}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div id="give-ngo-directory" className="space-y-5" dir={isUrdu ? 'rtl' : 'ltr'}>
      {/* Informative banner on transparency */}
      <div className="bg-[#2D5A27] text-white rounded-[32px] p-6 sm:p-7 shadow-xs border border-[#2D5A27]">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center shrink-0 mt-0.5 text-[#C5A059]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              {isUrdu ? 'مستند پاکستانی فلاحی ادارے' : 'Verified Pakistan NGO Directory'}
            </h2>
            <p className="text-xs sm:text-sm text-white/80 mt-1 leading-relaxed">
              {isUrdu
                ? 'ڈیلی دین ایپ خود کوئی رقم وصول نہیں کرتی۔ آپ کے عطیات اور صدقات براہ راست ان اداروں کے آفیشل پورٹل، ایزی پیسہ یا جاز کیش میں جمع ہوتے ہیں۔'
                : 'Daily Deen does not process payments or take cuts. All links redirect directly to official NGO donation portals, EasyPaisa, or JazzCash.'}
            </p>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="space-y-3">
        {/* Search box */}
        <div className="relative">
          <Search className={`w-4 h-4 text-stone-400 absolute top-1/2 -translate-y-1/2 ${isUrdu ? 'right-3.5' : 'left-3.5'}`} />
          <input
            id="ngo-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isUrdu ? 'این جی او یا شعبہ تلاش کریں (مثلاً ایدھی، کینسر، کھانا)...' : 'Search NGO by name or cause (e.g. Edhi, Hospital, Food)...'}
            className={`w-full bg-white rounded-2xl border border-[#E8E6DF] py-3 text-xs sm:text-sm text-[#2D3436] placeholder:text-stone-400 focus:outline-hidden focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/20 transition-all ${
              isUrdu ? 'pr-10 pl-4' : 'pl-10 pr-4'
            }`}
          />
        </div>

        {/* Category Pills Scrollable */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-[#2D5A27] text-white shadow-xs'
                    : 'bg-white text-[#2D3436] hover:bg-[#F9F8F4] border border-[#E8E6DF]'
                }`}
              >
                {isUrdu ? cat.labelUr : cat.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* NGOs List */}
      <div className="space-y-4">
        {filteredNgos.length === 0 ? (
          <div className="bg-white rounded-[32px] p-8 text-center border border-[#E8E6DF] text-stone-500 text-sm">
            {isUrdu ? 'کوئی ادارہ نہیں ملا۔ براہ کرم تلاش کے الفاظ تبدیل کریں۔' : 'No organizations found matching your search.'}
          </div>
        ) : (
          filteredNgos.map((ngo) => {
            const isExpanded = expandedNgoId === ngo.id;

            return (
              <div
                key={ngo.id}
                id={`ngo-card-${ngo.id}`}
                className="bg-white rounded-[32px] p-6 sm:p-7 shadow-xs border border-[#E8E6DF] hover:border-[#C5A059] transition-all"
              >
                {/* NGO Card Top */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-bold text-[#2D3436]">
                        {isUrdu ? ngo.nameUr : ngo.nameEn}
                      </h3>
                      {ngo.verified && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#2D5A27]/10 border border-[#2D5A27]/20 text-[10px] font-bold text-[#2D5A27]">
                          <CheckCircle2 className="w-3 h-3 text-[#2D5A27]" />
                          {isUrdu ? 'تصدیق شدہ' : 'Verified'}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-[#C5A059] bg-[#FFF9EA] border border-[#F3E5C2] px-2.5 py-0.5 rounded-full inline-block mt-1.5">
                      {isUrdu ? ngo.categoryLabelUr : ngo.categoryLabelEn}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
                  {isUrdu ? ngo.shortDescUr : ngo.shortDescEn}
                </p>

                {/* Highlighted Cause / Appeal */}
                <div className="bg-[#F9F8F4] rounded-2xl p-3.5 my-3 border border-[#E8E6DF] flex items-center gap-2 text-xs text-[#2D3436]">
                  <Heart className="w-4 h-4 text-[#2D5A27] shrink-0" />
                  <span className="font-medium">
                    {isUrdu ? ngo.highlightedCauseUr : ngo.highlightedCauseEn}
                  </span>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#E8E6DF]">
                  {/* Official Donation Portal Button */}
                  <button
                    id={`ngo-donate-btn-${ngo.id}`}
                    onClick={() => handleDonateClick(ngo)}
                    className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-[#2D5A27] hover:bg-[#23461e] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
                  >
                    <span>{isUrdu ? 'آن لائن عطیہ دیں' : 'Donate Online'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  {/* WhatsApp Support Button */}
                  {ngo.whatsAppNumber && (
                    <button
                      id={`ngo-whatsapp-btn-${ngo.id}`}
                      onClick={() => handleWhatsAppClick(ngo)}
                      className="flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-2xl bg-[#F9F8F4] hover:bg-[#E8E6DF] text-[#2D3436] border border-[#E8E6DF] text-xs font-semibold transition-colors"
                      title={isUrdu ? 'واٹس ایپ پر معلومات' : 'WhatsApp Inquiry'}
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#2D5A27]" />
                      <span className="hidden xs:inline">WhatsApp</span>
                    </button>
                  )}

                  {/* Toggle Account Details */}
                  <button
                    id={`ngo-details-toggle-${ngo.id}`}
                    onClick={() => setExpandedNgoId(isExpanded ? null : ngo.id)}
                    className="flex items-center justify-center gap-1 px-3.5 py-3 rounded-2xl bg-[#F9F8F4] hover:bg-[#E8E6DF] text-[#2D3436] border border-[#E8E6DF] text-xs font-semibold transition-colors"
                  >
                    <span>{isUrdu ? 'بینک و ایزی پیسہ' : 'Payment Accounts'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Expanded Payment Methods (EasyPaisa, JazzCash, IBAN) */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-[#E8E6DF] space-y-2 bg-[#F9F8F4] p-4 rounded-2xl text-xs">
                    <p className="font-bold text-[#2D3436]">
                      {isUrdu ? 'ادائیگی کے ذرائع و اکاؤنٹ نمبرز:' : 'Official Account Details:'}
                    </p>

                    {ngo.paymentMethods.easyPaisa && (
                      <div className="flex items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-[#E8E6DF]">
                        <div>
                          <span className="font-bold text-[#2D5A27]">EasyPaisa: </span>
                          <span className="text-[#2D3436] font-mono">{ngo.paymentMethods.easyPaisa}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(ngo.paymentMethods.easyPaisa!, `easypaisa-${ngo.id}`)}
                          className="p-1.5 text-stone-500 hover:text-[#2D5A27]"
                          title="Copy details"
                        >
                          {copiedKey === `easypaisa-${ngo.id}` ? (
                            <Check className="w-3.5 h-3.5 text-[#2D5A27]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}

                    {ngo.paymentMethods.jazzCash && (
                      <div className="flex items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-[#E8E6DF]">
                        <div>
                          <span className="font-bold text-[#C5A059]">JazzCash: </span>
                          <span className="text-[#2D3436] font-mono">{ngo.paymentMethods.jazzCash}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(ngo.paymentMethods.jazzCash!, `jazzcash-${ngo.id}`)}
                          className="p-1.5 text-stone-500 hover:text-[#2D5A27]"
                          title="Copy details"
                        >
                          {copiedKey === `jazzcash-${ngo.id}` ? (
                            <Check className="w-3.5 h-3.5 text-[#2D5A27]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}

                    {ngo.paymentMethods.iban && (
                      <div className="flex items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-[#E8E6DF]">
                        <div className="min-w-0">
                          <span className="font-bold text-[#2D3436] block">Bank IBAN:</span>
                          <span className="font-mono text-[11px] text-[#4A4A4A] break-all select-all">
                            {ngo.paymentMethods.iban}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(ngo.paymentMethods.iban!, `iban-${ngo.id}`)}
                          className="p-1.5 text-stone-500 hover:text-[#2D5A27] shrink-0"
                          title="Copy IBAN"
                        >
                          {copiedKey === `iban-${ngo.id}` ? (
                            <Check className="w-3.5 h-3.5 text-[#2D5A27]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}

                    {ngo.phone && (
                      <div className="text-[#4A4A4A] text-[11px] pt-1">
                        <span>📞 Helpline: {ngo.phone}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
