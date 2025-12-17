import React from 'react';
import { DailyPrediction } from '../types';
import { TRANSLATIONS } from '../constants';
import { playSound } from '../utils/sounds';

interface HistoryItem {
  date: string;
  prediction: DailyPrediction;
}

interface Props {
  history: HistoryItem[];
  onSelect: (item: DailyPrediction) => void;
  onBack: () => void;
}

export const HistoryView: React.FC<Props> = ({ history, onSelect, onBack }) => {
  const t = TRANSLATIONS;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex items-center justify-between mb-6">
        <button 
            onClick={() => { playSound('click'); onBack(); }}
            className="text-amber-200/70 hover:text-amber-100 flex items-center gap-2 transition-colors uppercase text-xs tracking-widest"
        >
            <span>←</span> {t.back}
        </button>
        <h2 className="font-mystic text-xl text-amber-100/90">{t.historyTitle}</h2>
      </div>

      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="glass-panel p-8 rounded-xl text-center border-white/5">
            <p className="text-purple-200/50 italic">{t.historyEmpty}</p>
          </div>
        ) : (
          history.map((item, idx) => (
            <div 
              key={idx}
              onClick={() => { playSound('click'); onSelect(item.prediction); }}
              className="glass-panel p-5 rounded-xl border border-white/5 hover:border-amber-500/30 hover:bg-white/5 transition-all cursor-pointer group animate-[slideUp_0.3s_ease-out]"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex justify-between items-start">
                <div>
                   <span className="text-[10px] text-purple-400 uppercase tracking-wider block mb-1">
                     {new Date(item.date).toLocaleDateString()} • {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                   </span>
                   <h3 className="font-mystic text-lg text-amber-50 group-hover:text-amber-200 transition-colors">
                     {item.prediction.headline}
                   </h3>
                </div>
                <div 
                   className="w-8 h-8 rounded-full shadow-[0_0_10px_currentColor] opacity-50 group-hover:opacity-100 transition-opacity" 
                   style={{ backgroundColor: item.prediction.powerColorHex, color: item.prediction.powerColorHex }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};