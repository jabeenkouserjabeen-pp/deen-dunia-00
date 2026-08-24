import React, { useState } from 'react';
import { Heart, ArrowRight, CheckCircle2, Sparkles, Plus, Smile, DollarSign, Utensils, HelpingHand } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyReflection, SadqaLogEntry } from '../types';
import { audioService } from '../services/audioService';

interface Props {
  reflection: DailyReflection;
  language: 'en' | 'ur';
  hasLoggedToday: boolean;
  totalSadqaLogsCount: number;
  onLogSadqa: (type: SadqaLogEntry['type']) => void;
  onOpenGiveDirectory: () => void;
}

export const SadqaNudgeCard: React.FC<Props> = ({
  reflection,
  language,
  hasLoggedToday,
  totalSadqaLogsCount,
  onLogSadqa,
  onOpenGiveDirectory,
}) => {
  const isUrdu = language === 'ur';
  const [showLogOptions, setShowLogOptions] = useState(false);

  const handleQuickLog = (type: SadqaLogEntry['type']) => {
    audioService.playSadqaJoyTone();
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#2D5A27', '#C5A059', '#10b981', '#f59e0b'],
      });
    } catch (e) {
      // ignore
    }
    onLogSadqa(type);
    setShowLogOptions(false);
  };

  return (
    <div
      id="sadqa-nudge-card"
      className="bg-white border border-[#E8E6DF] rounded-[32px] p-6 sm:p-8 shadow-xs relative transition-all"
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Main Content Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-[#C5A059] font-bold text-xs uppercase tracking-widest">
              {isUrdu ? 'آج کا صدقہ و نیکی' : 'Daily Sadqa Nudge'}
            </p>
            {totalSadqaLogsCount > 0 && (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#C5A059]/15 text-[#2D5A27] border border-[#C5A059]/30">
                {totalSadqaLogsCount} {isUrdu ? 'دن مکمل' : 'Days Logged'}
              </span>
            )}
          </div>

          <h4 className="text-xl sm:text-2xl font-bold text-[#2D3436] mb-2 leading-tight">
            {isUrdu ? reflection.quoteUr : reflection.quoteEn}
          </h4>

          <p className="text-xs sm:text-sm text-stone-500 mb-5 leading-relaxed">
            {isUrdu
              ? `— ${reflection.sourceUr} • آپ کا چھوٹا سا عمل کسی کی زندگی بدل سکتا ہے۔`
              : `— ${reflection.sourceEn}. Your small gift of charity or kindness brings immense reward.`}
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Explore NGO List Button */}
            <button
              id="explore-ngos-sadqa-btn"
              onClick={onOpenGiveDirectory}
              className="bg-[#2D5A27] hover:bg-[#23461e] text-white px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md active:scale-95 flex items-center gap-2 transition-all"
            >
              <span>{isUrdu ? 'مستند فلاحی ادارے دیکھیں' : 'Explore NGO List'}</span>
              <ArrowRight className={`w-4 h-4 ${isUrdu ? 'rotate-180' : ''}`} />
            </button>

            {/* Quick Sadqa Log Button */}
            {!hasLoggedToday ? (
              <button
                id="log-sadqa-quick-btn"
                onClick={() => setShowLogOptions(!showLogOptions)}
                className="bg-[#F9F8F4] hover:bg-[#E8E6DF] text-[#2D3436] border border-[#E8E6DF] px-5 py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4 text-[#C5A059]" />
                <span>{isUrdu ? 'صدقہ لاگ کریں' : 'Log Sadqa'}</span>
              </button>
            ) : (
              <div className="bg-[#FFF9EA] text-[#2D5A27] border border-[#F3E5C2] px-4 py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2D5A27]" />
                <span>{isUrdu ? 'آج مکمل ہوا ✓' : 'Logged Today ✓'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right side Geometric Cause Badge */}
        <div className="w-full sm:w-1/3 aspect-square sm:aspect-auto sm:h-44 bg-[#F9F8F4] rounded-[24px] border border-[#E8E6DF] flex flex-col items-center justify-center text-center p-5 shrink-0">
          <div className="text-4xl mb-2">🌿</div>
          <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">
            {isUrdu ? 'مسلسل نیکی' : 'DAILY CHARITY'}
          </span>
          <span className="text-sm font-bold text-[#2D5A27] mt-1">
            {isUrdu ? 'صدقہ و احسان' : 'Barakah in Giving'}
          </span>
        </div>
      </div>

      {/* Quick Log Options dropdown/tray */}
      {showLogOptions && !hasLoggedToday && (
        <div className="bg-[#F9F8F4] rounded-2xl p-4 border border-[#E8E6DF] shadow-md animate-in fade-in zoom-in-95 duration-200 mt-4">
          <p className="text-xs font-semibold text-[#2D3436] mb-3">
            {isUrdu ? 'آپ نے آج کس قسم کی نیکی کی؟' : 'What kind of charity did you perform today?'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => handleQuickLog('money')}
              className="flex items-center gap-2 p-3 rounded-xl bg-white hover:bg-[#2D5A27]/10 text-[#2D3436] text-xs font-semibold border border-[#E8E6DF] transition-colors"
            >
              <DollarSign className="w-4 h-4 text-[#2D5A27] shrink-0" />
              <span>{isUrdu ? 'مالی صدقہ' : 'Donated Money'}</span>
            </button>

            <button
              onClick={() => handleQuickLog('food')}
              className="flex items-center gap-2 p-3 rounded-xl bg-white hover:bg-[#2D5A27]/10 text-[#2D3436] text-xs font-semibold border border-[#E8E6DF] transition-colors"
            >
              <Utensils className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>{isUrdu ? 'کھانا کھلایا' : 'Fed Someone'}</span>
            </button>

            <button
              onClick={() => handleQuickLog('kindness')}
              className="flex items-center gap-2 p-3 rounded-xl bg-white hover:bg-[#2D5A27]/10 text-[#2D3436] text-xs font-semibold border border-[#E8E6DF] transition-colors"
            >
              <Smile className="w-4 h-4 text-[#2D5A27] shrink-0" />
              <span>{isUrdu ? 'مسکراہٹ' : 'Smile / Kind Word'}</span>
            </button>

            <button
              onClick={() => handleQuickLog('help')}
              className="flex items-center gap-2 p-3 rounded-xl bg-white hover:bg-[#2D5A27]/10 text-[#2D3436] text-xs font-semibold border border-[#E8E6DF] transition-colors"
            >
              <HelpingHand className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>{isUrdu ? 'کسی کی مدد' : 'Helped Someone'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

