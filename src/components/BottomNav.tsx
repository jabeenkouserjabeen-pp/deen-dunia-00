import React from 'react';
import { Home, Clock, BookOpen, Heart, Sliders } from 'lucide-react';

export type TabType = 'home' | 'prayers' | 'duas' | 'give' | 'settings';

interface Props {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  language: 'en' | 'ur';
}

export const BottomNav: React.FC<Props> = ({ currentTab, onTabChange, language }) => {
  const isUrdu = language === 'ur';

  const tabs: { id: TabType; labelEn: string; labelUr: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', labelEn: 'Home', labelUr: 'مرکز', icon: Home },
    { id: 'prayers', labelEn: 'Prayers', labelUr: 'نماز', icon: Clock },
    { id: 'duas', labelEn: 'Duas', labelUr: 'دعائیں', icon: BookOpen },
    { id: 'give', labelEn: 'Give Sadqa', labelUr: 'صدقہ / فلاح', icon: Heart },
    { id: 'settings', labelEn: 'Settings', labelUr: 'ترتیبات', icon: Sliders },
  ];

  return (
    <nav
      aria-label="App Navigation"
      id="app-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E6DF] py-2 px-3 safe-area-bottom shadow-xs"
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      <div className="max-w-xl mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all min-w-[58px] ${
                isActive
                  ? 'text-[#2D5A27] font-bold'
                  : 'text-stone-400 hover:text-[#2D3436]'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#2D5A27]/10 text-[#2D5A27] scale-105'
                    : 'text-stone-400'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive && tab.id === 'give' ? 'fill-[#2D5A27]' : ''}`} />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight whitespace-nowrap">
                {isUrdu ? tab.labelUr : tab.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
