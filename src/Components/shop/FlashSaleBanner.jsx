import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function FlashSaleBanner() {
  const { t } = useTranslation('shop');
  const [timeLeft, setTimeLeft] = useState({
    hours: 11,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-[#17233C] via-[#1E2E4F] to-[#17233C] text-white py-3 px-4 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-3 border border-slate-700/60">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E89A5B] text-white">
          <i className="fa-solid fa-bolt text-sm"></i>
        </span>
        <div>
          <span className="text-xs sm:text-sm font-bold block">
            {t('flashSaleTitle', 'Weekend Flash Deals!')}
          </span>
          <span className="text-[11px] text-slate-300">
            {t('flashSaleSub', 'Up to 40% discount on selected audio & tech gadgets.')}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2" dir="ltr">
        <div className="flex flex-col items-center bg-black/40 px-2 py-1 rounded-lg min-w-[36px]">
          <span className="text-xs font-bold text-[#E89A5B] font-mono">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-[9px] text-slate-400">{t('hoursUnit', 'HRS')}</span>
        </div>
        <span className="font-bold text-slate-400">:</span>
        <div className="flex flex-col items-center bg-black/40 px-2 py-1 rounded-lg min-w-[36px]">
          <span className="text-xs font-bold text-[#E89A5B] font-mono">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-[9px] text-slate-400">{t('minsUnit', 'MIN')}</span>
        </div>
        <span className="font-bold text-slate-400">:</span>
        <div className="flex flex-col items-center bg-black/40 px-2 py-1 rounded-lg min-w-[36px]">
          <span className="text-xs font-bold text-[#E89A5B] font-mono">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-[9px] text-slate-400">{t('secsUnit', 'SEC')}</span>
        </div>
      </div>
    </div>
  );
}