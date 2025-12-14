import React, { useState } from 'react';
import { TRANSLATIONS } from '../constants';

interface Props {
  onUnlock: () => void;
}

export const Paywall: React.FC<Props> = ({ onUnlock }) => {
  const t = TRANSLATIONS;
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = () => {
    // NOTE: This is where you would integrate Stripe, RevenueCat, or generic Payment API
    setIsLoading(true);
    setTimeout(() => {
      // Simulate successful payment
      setIsLoading(false);
      onUnlock();
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 animate-[fadeIn_0.5s_ease-out]">
      <div className="glass-panel rounded-3xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.2)] border-amber-500/20">
        
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="text-center relative z-10 space-y-6">
          <div className="text-5xl animate-pulse">🔒</div>
          
          <div>
            <h2 className="text-2xl font-mystic text-amber-100 uppercase tracking-widest mb-4 leading-relaxed">
              {t.paywallTitle}
            </h2>
            <p className="text-purple-200/90 font-serif italic text-sm leading-relaxed">
              {t.paywallDesc}
            </p>
          </div>

          <div className="space-y-4 py-4 text-left">
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-amber-400">✦</span>
                <span className="text-sm text-gray-200">{t.premiumBenefit1}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl opacity-70">
                <span className="text-purple-400">✦</span>
                <span className="text-sm text-gray-400">{t.premiumBenefit2}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl opacity-70">
                <span className="text-purple-400">✦</span>
                <span className="text-sm text-gray-400">{t.premiumBenefit3}</span>
            </div>
          </div>

          <button
            onClick={handlePurchase}
            disabled={isLoading}
            className="w-full relative group overflow-hidden py-4 rounded-xl font-mystic tracking-[0.2em] uppercase transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-r from-amber-600 to-yellow-700 text-white shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:shadow-[0_0_40px_rgba(245,158,11,0.7)] border border-amber-500/30"
          >
             <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? "Обработка..." : t.subscribeAction}
                {!isLoading && <span className="text-xl">✨</span>}
             </span>
             {/* Shine effect */}
             <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          </button>

          <button className="text-xs text-purple-400/60 hover:text-purple-300 uppercase tracking-widest mt-4">
            {t.restorePurchase}
          </button>

        </div>
      </div>
    </div>
  );
};