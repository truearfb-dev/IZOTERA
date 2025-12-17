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
    <div className="w-full max-w-2xl mx-auto p-4 animate-[fadeIn_1.5s_ease-out]">
      <div className="glass-panel rounded-xl overflow-hidden shadow-[0_0_50px_-10px_rgba(88,28,135,0.4)] border-amber-500/10 transform hover:scale-[1.01] transition-transform duration-700">
        
        {/* Header */}
        <div className="relative p-8 text-center border-b border-white/10">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-60"></div>
          <h3 className="text-purple-300 text-sm tracking-[0.3em] uppercase mb-2 animate-[fadeIn_1s_ease-out_0.5s_both]">
            {t.dailyGuidance} {userData.name}
          </h3>
          <h1 className="text-3xl md:text-5xl font-mystic text-amber-100 drop-shadow-lg leading-tight animate-[zoomIn_1s_ease-out_0.2s_both]">
            {data.headline}
          </h1>
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-8">
            
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatBar label={t.love} value={data.stats.love} color="bg-rose-500" delay={400} />
            <StatBar label={t.career} value={data.stats.career} color="bg-emerald-500" delay={600} />
            <StatBar label={t.vitality} value={data.stats.vitality} color="bg-amber-500" delay={800} />
          </div>

          {/* Main Insight */}
          <div className="bg-black/20 p-6 rounded-lg border border-purple-500/20 animate-[slideUp_1s_ease-out_1s_both]">
            <p className="text-xl leading-relaxed text-purple-100 font-serif italic text-center">
              "{data.insight}"
            </p>
          </div>

          {/* Footer Info */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-white/5 animate-[fadeIn_1s_ease-out_1.2s_both]">
            <div className="flex items-center gap-3">
               <span className="text-purple-300 text-sm uppercase tracking-wider">{t.powerColor}</span>
               <div className="flex items-center gap-2 group cursor-help">
                 <div 
                    className="w-6 h-6 rounded-full shadow-[0_0_10px_currentColor] group-hover:scale-125 transition-transform duration-500" 
                    style={{ backgroundColor: data.powerColorHex, color: data.powerColorHex }}
                 ></div>
                 <span className="font-mystic text-amber-100 group-hover:text-white transition-colors">{data.powerColor}</span>
               </div>
            </div>
            
            <button 
                onClick={() => { playSound('click'); onReset(); }}
                className="text-xs text-purple-400 hover:text-amber-200 transition-colors uppercase tracking-widest border-b border-transparent hover:border-amber-200 py-1"
            >
                {t.readAnother}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

const StatBar: React.FC<{ label: string; value: number; color: string; delay: number }> = ({ label, value, color, delay }) => {
  const [width, setWidth] = React.useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
        setWidth(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="space-y-2 opacity-0 animate-[fadeIn_0.5s_ease-out_both]" style={{ animationDelay: `${delay-200}ms` }}>
      <div className="flex justify-between text-xs uppercase tracking-wider text-purple-300">
        <span>{label}</span>
        <span>{width}%</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} shadow-[0_0_10px_currentColor] transition-all duration-[1500ms] ease-out`} 
          style={{ width: `${width}%` }}
        ></div>
      </div>
    </div>
  );
};