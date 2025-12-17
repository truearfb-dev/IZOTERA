import React, { useEffect } from 'react';
import { UserData, DailyPrediction } from '../types';
import { TRANSLATIONS } from '../constants';
import { playSound } from '../utils/sounds';

interface Props {
  data: DailyPrediction;
  userData: UserData;
  onReset: () => void;
}

export const NatalCard: React.FC<Props> = ({ data, userData, onReset }) => {
  const t = TRANSLATIONS;

  useEffect(() => {
    playSound('success');
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center animate-[fadeIn_0.8s_ease-out]">
      <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_0_30px_-10px_rgba(88,28,135,0.4)] border-amber-500/10 flex flex-col max-h-[85vh]">
        
        {/* Header - Very Compact */}
        <div className="relative p-5 text-center border-b border-white/5 shrink-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
          <h3 className="text-purple-300/80 text-[10px] tracking-[0.3em] uppercase mb-1">
            {t.dailyGuidance} {userData.name}
          </h3>
          <h1 className="text-xl md:text-3xl font-mystic text-amber-100 drop-shadow-md leading-tight">
            {data.headline}
          </h1>
        </div>

        {/* Content Body - Scrollable if text is huge, but usually fits */}
        <div className="p-5 flex flex-col gap-5 overflow-y-auto no-scrollbar">
            
          {/* Main Insight - MOVED TOP to avoid "Empty Space" look */}
          <div className="bg-black/20 p-4 rounded-xl border border-purple-500/10 animate-[slideUp_0.8s_ease-out_0.2s_both]">
            <p className="text-base md:text-lg leading-relaxed text-purple-100 font-serif italic text-center text-pretty">
              "{data.insight}"
            </p>
          </div>

          {/* Stats Grid - Moved Down & Compacted */}
          <div className="space-y-3">
             <div className="grid grid-cols-3 gap-3">
                <StatBar compact label={t.love} value={data.stats.love} color="bg-rose-500" delay={400} />
                <StatBar compact label={t.career} value={data.stats.career} color="bg-emerald-500" delay={600} />
                <StatBar compact label={t.vitality} value={data.stats.vitality} color="bg-amber-500" delay={800} />
             </div>
          </div>

          {/* Footer Info */}
          <div className="flex justify-between items-center pt-2 border-t border-white/5 mt-auto shrink-0">
            <div className="flex items-center gap-2">
               <span className="text-purple-400 text-[10px] uppercase tracking-wider">{t.powerColor}</span>
               <div className="flex items-center gap-2 group">
                 <div 
                    className="w-4 h-4 rounded-full shadow-[0_0_8px_currentColor]" 
                    style={{ backgroundColor: data.powerColorHex, color: data.powerColorHex }}
                 ></div>
                 <span className="font-mystic text-xs text-amber-100">{data.powerColor}</span>
               </div>
            </div>
            
            <button 
                onClick={() => { playSound('click'); onReset(); }}
                className="text-[10px] text-purple-400/70 hover:text-amber-200 uppercase tracking-widest border-b border-transparent hover:border-amber-200 transition-all"
            >
                {t.readAnother}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

const StatBar: React.FC<{ label: string; value: number; color: string; delay: number; compact?: boolean }> = ({ label, value, color, delay, compact }) => {
  const [width, setWidth] = React.useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
        setWidth(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="space-y-1 opacity-0 animate-[fadeIn_0.5s_ease-out_both]" style={{ animationDelay: `${delay-200}ms` }}>
      <div className="flex justify-between text-[9px] uppercase tracking-wider text-purple-300/80">
        <span>{label}</span>
        <span>{width}%</span>
      </div>
      <div className={`${compact ? 'h-1' : 'h-1.5'} bg-gray-800/50 rounded-full overflow-hidden`}>
        <div 
          className={`h-full ${color} shadow-[0_0_8px_currentColor] transition-all duration-[1500ms] ease-out`} 
          style={{ width: `${width}%` }}
        ></div>
      </div>
    </div>
  );
};