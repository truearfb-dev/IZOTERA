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
    <div className="w-full h-full flex flex-col justify-center animate-[fadeIn_0.5s_ease-out]">
      <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl border-slate-700/50 flex flex-col max-h-[85vh]">
        
        {/* Header - Clean */}
        <div className="p-6 border-b border-slate-700/50 bg-slate-800/30">
          <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
              <div 
                 className="w-3 h-3 rounded-full shadow-sm" 
                 style={{ backgroundColor: data.powerColorHex }}
              ></div>
          </div>
          <h1 className="text-2xl font-bold text-white leading-tight">
            {data.headline}
          </h1>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col gap-6 overflow-y-auto no-scrollbar">
            
          {/* Insight Context */}
          <div>
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Контекст дня</h3>
             <p className="text-slate-200 text-sm leading-relaxed border-l-2 border-blue-500 pl-3">
               {data.insight}
             </p>
          </div>

          {/* Action Plan - The "Simple Steps" */}
          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">План действий</h3>
             <ul className="space-y-3">
               {data.actionPlan.map((step, idx) => (
                 <li key={idx} className="flex items-start gap-3 animate-[slideUp_0.5s_ease-out_both]" style={{ animationDelay: `${idx * 150}ms` }}>
                    <div className="mt-0.5 min-w-[20px] h-5 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                      {idx + 1}
                    </div>
                    <span className="text-sm text-white">{step}</span>
                 </li>
               ))}
             </ul>
          </div>

          {/* Stats Grid - Minimal */}
          <div className="grid grid-cols-3 gap-4 py-2">
             <StatBox label={t.statFocus} value={data.stats.focus} />
             <StatBox label={t.statEnergy} value={data.stats.energy} />
             <StatBox label={t.statMood} value={data.stats.mood} />
          </div>

          {/* Footer Info */}
          <div className="flex justify-center pt-4 border-t border-slate-700/50 mt-auto">
            <button 
                onClick={() => { playSound('click'); onReset(); }}
                className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
                {t.readAnother}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

const StatBox: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="text-center p-2 rounded-lg bg-slate-800/30">
    <div className="text-xl font-bold text-white mb-1">{value}%</div>
    <div className="text-[10px] uppercase text-slate-500 font-medium">{label}</div>
  </div>
);