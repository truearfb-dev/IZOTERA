import React, { useState } from 'react';
import { UserData, Focus } from '../types';
import { calculateZodiac } from '../utils/astrology';
import { TRANSLATIONS, FOCUS_ICONS, ZODIAC_NAMES } from '../constants';

interface Props {
  onComplete: (data: UserData) => void;
}

export const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserData>>({
    name: '',
    dob: '',
    tob: '',
    focus: null,
  });

  const t = TRANSLATIONS;

  const handleNext = () => {
    if (step === 1 && formData.dob) {
      const sign = calculateZodiac(formData.dob);
      setFormData(prev => ({ ...prev, zodiacSign: sign }));
      setStep(prev => prev + 1);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const capitalized = val.length > 0 ? val.charAt(0).toUpperCase() + val.slice(1) : val;
    setFormData({ ...formData, name: capitalized });
  };

  const handleSubmit = () => {
    if (formData.name && formData.dob && formData.focus) {
      onComplete(formData as UserData);
    }
  };

  const isStep1Valid = formData.name && formData.dob;
  
  // Auto-submit step 2 when focus is selected, or use button? 
  // Let's use button for explicit confirmation.
  const isStep2Valid = formData.tob && formData.focus;

  return (
    <div className="w-full h-full flex flex-col justify-center animate-[fadeIn_0.4s_ease-out]">
      <div className="glass-panel rounded-2xl w-full max-h-[85vh] overflow-y-auto no-scrollbar p-6 shadow-xl flex flex-col gap-6 relative border border-slate-700/50">
        
        {/* Progress Bar - Minimal */}
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
           <div 
             className="h-full bg-blue-500 transition-all duration-500 ease-out"
             style={{ width: `${(step / 2) * 100}%` }}
           ></div>
        </div>

        {/* Step 1: Data */}
        {step === 1 && (
          <div className="space-y-6 animate-[slideUp_0.3s_ease-out] text-center pt-2">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-slate-100">
                  {t.identifyYourself}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {t.starsNeedName}
                </p>
            </div>
            
            <div className="space-y-4">
              <div className="text-left">
                <label className="text-xs font-medium text-slate-400 mb-1.5 block ml-1">
                  {t.nameLabel}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="input-mystic w-full p-4 text-lg text-white placeholder:text-slate-600"
                  placeholder={t.namePlaceholder}
                />
              </div>
              
              <div className="text-left">
                <label className="text-xs font-medium text-slate-400 mb-1.5 block ml-1">
                  {t.dobLabel}
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  className="input-mystic w-full p-4 text-lg text-white [color-scheme:dark]"
                />
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!isStep1Valid}
              className={`w-full py-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                isStep1Valid 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {t.revealSigns}
            </button>
          </div>
        )}

        {/* Step 2: Time & Focus */}
        {step === 2 && (
          <div className="space-y-6 animate-[slideUp_0.3s_ease-out] text-center pt-2">
            <div>
                <h2 className="text-2xl font-semibold text-slate-100 mb-1">{t.preciseMoment}</h2>
                <p className="text-slate-400 text-xs max-w-xs mx-auto">{t.calculateAscendant}</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-3 inline-flex items-center gap-2 mx-auto border border-slate-700">
                <span className="text-amber-400">☀️</span>
                <span className="text-slate-200 text-sm font-medium">
                  {formData.zodiacSign ? ZODIAC_NAMES[formData.zodiacSign] : ''}
                </span>
            </div>
            
            {/* Time Input */}
            <div className="text-left">
                 <label className="text-xs font-medium text-slate-400 mb-1.5 block ml-1">
                    {t.tobLabel}
                 </label>
                 <input
                    type="time"
                    value={formData.tob}
                    onChange={e => setFormData({ ...formData, tob: e.target.value })}
                    className="input-mystic w-full p-3 text-center text-2xl text-white [color-scheme:dark]"
                 />
            </div>

            {/* Focus Selection */}
            <div className="space-y-2 text-left">
               <label className="text-xs font-medium text-slate-400 ml-1 block">{t.currentState}</label>
               <div className="grid grid-cols-1 gap-2">
                  {[Focus.Productivity, Focus.Finance, Focus.Relationships, Focus.Wellbeing].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormData({ ...formData, focus: f })}
                      className={`p-3 rounded-lg border flex items-center gap-3 transition-all ${
                        formData.focus === f
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-xl">{FOCUS_ICONS[f]}</span>
                      <span className="text-sm font-medium">{t[f]}</span>
                      {formData.focus === f && <div className="ml-auto w-2 h-2 rounded-full bg-blue-500"></div>}
                    </button>
                  ))}
               </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!isStep2Valid}
              className={`w-full py-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                isStep2Valid
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {t.continue}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};