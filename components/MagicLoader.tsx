import React, { useEffect, useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface Props {
  lang: Language;
}

export const MagicLoader: React.FC<Props> = ({ lang }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = TRANSLATIONS[lang].messages;

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 800);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 animate-[fadeIn_1s_ease-out]">
      {/* Mystical Spinner */}
      <div className="relative w-40 h-40">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-2 border-dashed border-purple-500/30 rounded-full animate-spin-slow"></div>
        
        {/* Middle Ring */}
        <div className="absolute inset-4 border border-amber-400/20 rounded-full animate-[spin-slow_8s_linear_reverse_infinite]"></div>
        
        {/* Center Pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-amber-100 rounded-full shadow-[0_0_30px_10px_rgba(251,191,36,0.6)] animate-pulse-glow"></div>
        </div>

        {/* Orbiting Elements */}
        <div className="absolute inset-0 animate-[spin-slow_3s_linear_infinite]">
            <div className="w-2 h-2 bg-purple-400 rounded-full absolute top-0 left-1/2 -translate-x-1/2 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
        </div>
      </div>

      {/* Text */}
      <div className="h-8">
        <p className="text-amber-100 font-mystic tracking-widest text-lg text-center animate-pulse">
          {messages[messageIndex]}
        </p>
      </div>
    </div>
  );
};