import React, { useState } from 'react';
import { UserData, Feeling, Element, Archetype } from '../types';
import { calculateZodiac } from '../utils/astrology';
import { TRANSLATIONS, FEELING_ICONS, ZODIAC_NAMES, ELEMENT_ICONS, ARCHETYPE_ICONS } from '../constants';

interface Props {
  onComplete: (data: UserData) => void;
}

export const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserData>>({
    name: '',
    dob: '',
    tob: '',
    element: null,
    archetype: null,
    feeling: null,
  });

  const t = TRANSLATIONS;

  const handleNext = () => {
    if (step === 1 && formData.dob) {
      const sign = calculateZodiac(formData.dob);
      setFormData(prev => ({ ...prev, zodiacSign: sign }));
    }
    setStep(prev => prev + 1);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const capitalized = val.length > 0 ? val.charAt(0).toUpperCase() + val.slice(1) : val;
    setFormData({ ...formData, name: capitalized });
  };

  const handleSubmit = () => {
    if (formData.name && formData.dob && formData.feeling && formData.element && formData.archetype) {
      onComplete(formData as UserData);
    }
  };

  const isStep1Valid = formData.name && formData.dob;
  const isStep2Valid = formData.tob;

  return (
    <div className="w-full h-full flex flex-col justify-center animate-[fadeIn_0.6s_ease-out]">
      {/* Compact Container: p-4 instead of p-5/p-6 */}
      <div className="glass-panel rounded-xl p-4 shadow-[0_0_20px_-5px_rgba(48,43,99,0.5)] border border-white/5 flex flex-col gap-3">
        
        {/* Progress Bar - Ultra Tiny */}
        <div className="flex justify-center gap-1 mb-1 shrink-0">
           {[1, 2, 3, 4, 5].map(i => (
             <div 
               key={i} 
               className={`h-0.5 rounded-full transition-all duration-500 ${step >= i ? 'w-4 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'w-2 bg-white/10'}`}
             ></div>
           ))}
        </div>

        {/* Step 1: Identity */}
        {step === 1 && (
          <div className="space-y-3 animate-[slideUp_0.4s_ease-out] text-center">
            <div className="border-b border-white/5 pb-2">
                <h2 className="text-lg font-mystic text-amber-100 mb-1">{t.identifyYourself}</h2>
                <p className="text-purple-200 text-[10px] leading-tight italic opacity-80 line-clamp-4">
                  {t.starsNeedName}
                </p>
            </div>
            
            <div className="space-y-2">
              <div>
                <label className="block text-[9px] text-amber-200/50 uppercase tracking-widest mb-1 text-left pl-1">{t.nameLabel}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-center text-base text-amber-50 font-mystic focus:border-amber-400/50 focus:bg-white/10 focus:outline-none transition-all placeholder:text-white/20"
                  placeholder={t.namePlaceholder}
                />
              </div>
              <div>
                <label className="block text-[9px] text-amber-200/50 uppercase tracking-widest mb-1 text-left pl-1">{t.dobLabel}</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-center text-base text-amber-50 font-mystic focus:border-amber-400/50 focus:bg-white/10 focus:outline-none transition-all [color-scheme:dark]"
                />
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!isStep1Valid}
              className={`w-full py-2.5 mt-1 rounded-lg font-mystic tracking-[0.2em] text-xs uppercase transition-all duration-300 ${
                isStep1Valid 
                  ? 'bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-500/30 text-white shadow-lg' 
                  : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
              }`}
            >
              {t.revealSigns}
            </button>
          </div>
        )}

        {/* Step 2: Time */}
        {step === 2 && (
          <div className="space-y-4 animate-[slideUp_0.4s_ease-out] text-center">
            <div>
                <h2 className="text-xl font-mystic text-amber-100 mb-1">{t.preciseMoment}</h2>
                <p className="text-purple-200 text-[10px] italic opacity-80">{t.calculateAscendant}</p>
            </div>
            
            <div className="space-y-3">
              <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-200 font-mystic tracking-widest text-[10px]">
                {formData.zodiacSign ? ZODIAC_NAMES[formData.zodiacSign] : ''} • {t.sunDetected}
              </div>
              
              <input
                type="time"
                value={formData.tob}
                onChange={e => setFormData({ ...formData, tob: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-center text-xl text-amber-50 font-mystic focus:border-amber-400/50 focus:bg-white/10 focus:outline-none transition-all [color-scheme:dark]"
              />
            </div>

            <button
              onClick={handleNext}
              disabled={!isStep2Valid}
              className={`w-full py-2.5 mt-2 rounded-lg font-mystic tracking-[0.2em] text-xs uppercase transition-all duration-300 ${
                isStep2Valid
                  ? 'bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-500/30 text-white'
                  : 'bg-white/5 text-white/20 cursor-not-allowed'
              }`}
            >
              {t.continue}
            </button>
          </div>
        )}

        {/* Step 3: Elements */}
        {step === 3 && (
          <div className="space-y-3 animate-[slideUp_0.4s_ease-out] text-center">
            <div>
                <h2 className="text-lg font-mystic text-amber-100">{t.elementalCore}</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {[Element.Fire, Element.Water, Element.Air, Element.Earth].map((el) => (
                <button
                  key={el}
                  onClick={() => setFormData({ ...formData, element: el })}
                  className={`group relative p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                    formData.element === el
                      ? 'bg-amber-500/10 border-amber-400/50'
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`text-xl`}>{ELEMENT_ICONS[el]}</div>
                  <div className="space-y-0.5">
                      <span className={`font-mystic text-[10px] uppercase tracking-widest block ${formData.element === el ? 'text-amber-100' : 'text-purple-200'}`}>
                        {t[el]}
                      </span>
                  </div>
                </button>
              ))}
            </div>
            {formData.element && <NextButton onClick={handleNext} text={t.continue} />}
          </div>
        )}

        {/* Step 4: Archetype */}
        {step === 4 && (
          <div className="space-y-3 animate-[slideUp_0.4s_ease-out] text-center">
            <div>
                <h2 className="text-lg font-mystic text-amber-100">{t.theMirror}</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {[Archetype.Warrior, Archetype.Healer, Archetype.Sage, Archetype.Creator].map((arch) => (
                <button
                  key={arch}
                  onClick={() => setFormData({ ...formData, archetype: arch })}
                  className={`group relative p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                    formData.archetype === arch
                      ? 'bg-amber-500/10 border-amber-400/50'
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`text-xl`}>{ARCHETYPE_ICONS[arch]}</div>
                  <span className={`font-mystic text-[10px] uppercase tracking-widest block ${formData.archetype === arch ? 'text-amber-100' : 'text-purple-200'}`}>
                    {t[arch]}
                  </span>
                </button>
              ))}
            </div>
            {formData.archetype && <NextButton onClick={handleNext} text={t.continue} />}
          </div>
        )}

        {/* Step 5: Feeling */}
        {step === 5 && (
          <div className="space-y-3 animate-[slideUp_0.4s_ease-out] text-center">
            <div>
                <h2 className="text-lg font-mystic text-amber-100">{t.currentState}</h2>
            </div>
            
            <div className="flex flex-col gap-2">
              {[Feeling.Lost, Feeling.Energetic, Feeling.SeekingLove, Feeling.FocusOnMoney].map((feelingKey) => (
                <button
                  key={feelingKey}
                  onClick={() => setFormData({ ...formData, feeling: feelingKey })}
                  className={`group relative p-2 rounded-lg border flex items-center gap-2 transition-all duration-300 ${
                    formData.feeling === feelingKey
                      ? 'bg-amber-500/10 border-amber-400/50'
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-black/30 border border-white/10 text-sm">
                     {FEELING_ICONS[feelingKey]}
                  </div>
                  <span className={`font-mystic text-xs tracking-wide ${formData.feeling === feelingKey ? 'text-amber-100' : 'text-gray-300'}`}>
                    {t[feelingKey]}
                  </span>
                  
                  <div className={`ml-auto w-1.5 h-1.5 rounded-full transition-all ${formData.feeling === feelingKey ? 'bg-amber-400' : 'bg-transparent border border-white/20'}`}></div>
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!formData.feeling}
              className={`w-full py-2.5 mt-2 rounded-lg font-mystic tracking-[0.2em] text-xs uppercase transition-all duration-300 ${
                formData.feeling
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-700 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t.consultStars}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const NextButton = ({ onClick, text }: { onClick: () => void, text: string }) => (
    <button 
    onClick={onClick} 
    className="text-[10px] font-mystic uppercase tracking-widest text-amber-200 border-b border-amber-200/50 hover:text-white animate-[fadeIn_0.3s_ease-out] mt-1"
    >
    {text}
    </button>
);