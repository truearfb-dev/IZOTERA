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
      {/* 
         UI FIX: max-h-[85vh] prevents it from going off screen.
         overflow-y-auto allows internal scrolling if the phone is tiny, preserving design integrity.
      */}
      <div className="glass-panel rounded-2xl w-full max-h-[85vh] overflow-y-auto no-scrollbar p-6 shadow-2xl flex flex-col gap-6 relative">
        
        {/* Progress Bar - Elegant Top Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
           <div 
             className="h-full bg-gradient-to-r from-amber-600 to-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.5)] transition-all duration-500 ease-out"
             style={{ width: `${(step / 5) * 100}%` }}
           ></div>
        </div>

        {/* Step 1: Identity */}
        {step === 1 && (
          <div className="space-y-6 animate-[slideUp_0.4s_ease-out] text-center pt-2">
            <div className="space-y-2">
                <h2 className="text-2xl font-mystic text-transparent bg-clip-text bg-gradient-to-r from-amber-100 to-amber-400 drop-shadow-sm">
                  {t.identifyYourself}
                </h2>
                <p className="text-purple-200 text-sm leading-relaxed font-light opacity-90">
                  {t.starsNeedName}
                </p>
            </div>
            
            <div className="space-y-4 px-2">
              {/* Centered Name Input */}
              <div className="text-center group">
                <label className="text-[10px] text-amber-200/70 uppercase tracking-[0.2em] mb-1.5 block group-focus-within:text-amber-400 transition-colors">
                  {t.nameLabel}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="input-mystic w-full rounded-xl p-4 text-center text-lg text-white font-mystic placeholder:text-white/20"
                  placeholder={t.namePlaceholder}
                />
              </div>
              
              {/* Centered Date Input */}
              <div className="text-center group">
                <label className="text-[10px] text-amber-200/70 uppercase tracking-[0.2em] mb-1.5 block group-focus-within:text-amber-400 transition-colors">
                  {t.dobLabel}
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  className="input-mystic w-full rounded-xl p-4 text-center text-lg text-white font-mystic [color-scheme:dark]"
                />
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!isStep1Valid}
              className={`w-full py-4 rounded-xl font-mystic tracking-[0.25em] text-sm uppercase transition-all duration-300 transform active:scale-95 ${
                isStep1Valid 
                  ? 'bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-500/30 text-white shadow-[0_0_20px_rgba(88,28,135,0.4)] hover:shadow-[0_0_30px_rgba(88,28,135,0.6)]' 
                  : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
              }`}
            >
              {t.revealSigns}
            </button>
          </div>
        )}

        {/* Step 2: Time */}
        {step === 2 && (
          <div className="space-y-8 animate-[slideUp_0.4s_ease-out] text-center pt-2">
            <div>
                <h2 className="text-2xl font-mystic text-amber-100 mb-2">{t.preciseMoment}</h2>
                <div className="w-16 h-px bg-amber-500/30 mx-auto mb-3"></div>
                <p className="text-purple-200 text-xs italic opacity-80 max-w-xs mx-auto">{t.calculateAscendant}</p>
            </div>
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-900/20 border border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                <span className="text-xl">☀️</span>
                <span className="text-amber-100 font-mystic tracking-widest text-xs uppercase">
                  {formData.zodiacSign ? ZODIAC_NAMES[formData.zodiacSign] : ''}
                </span>
              </div>
              
              {/* Centered Time Input */}
              <div className="text-center group px-2">
                 <label className="text-[10px] text-amber-200/70 uppercase tracking-[0.2em] mb-2 block group-focus-within:text-amber-400 transition-colors">
                    {t.tobLabel}
                 </label>
                 <input
                    type="time"
                    value={formData.tob}
                    onChange={e => setFormData({ ...formData, tob: e.target.value })}
                    className="input-mystic w-full rounded-xl p-4 text-center text-3xl text-white font-mystic [color-scheme:dark]"
                 />
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!isStep2Valid}
              className={`w-full py-4 rounded-xl font-mystic tracking-[0.25em] text-sm uppercase transition-all duration-300 ${
                isStep2Valid
                  ? 'bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-500/30 text-white shadow-lg'
                  : 'bg-white/5 text-white/20 cursor-not-allowed'
              }`}
            >
              {t.continue}
            </button>
          </div>
        )}

        {/* Step 3: Elements */}
        {step === 3 && (
          <div className="space-y-6 animate-[slideUp_0.4s_ease-out] text-center pt-2">
            <div>
                <h2 className="text-2xl font-mystic text-amber-100">{t.elementalCore}</h2>
                <p className="text-purple-200/60 text-[10px] mt-1 uppercase tracking-widest">{t.forceGov}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[Element.Fire, Element.Water, Element.Air, Element.Earth].map((el) => (
                <button
                  key={el}
                  onClick={() => setFormData({ ...formData, element: el })}
                  className={`group relative h-32 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] ${
                    formData.element === el
                      ? 'bg-gradient-to-br from-amber-500/20 to-purple-900/40 border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`text-4xl drop-shadow-md transition-transform duration-500 ${formData.element === el ? 'scale-110' : 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'}`}>
                    {ELEMENT_ICONS[el]}
                  </div>
                  <span className={`font-mystic text-xs uppercase tracking-[0.2em] block ${formData.element === el ? 'text-amber-100' : 'text-purple-200/60'}`}>
                    {t[el]}
                  </span>
                </button>
              ))}
            </div>
            {formData.element && <NextButton onClick={handleNext} text={t.continue} />}
          </div>
        )}

        {/* Step 4: Archetype */}
        {step === 4 && (
          <div className="space-y-6 animate-[slideUp_0.4s_ease-out] text-center pt-2">
            <div>
                <h2 className="text-2xl font-mystic text-amber-100">{t.theMirror}</h2>
                <p className="text-purple-200/60 text-[10px] mt-1 uppercase tracking-widest">{t.mirrorVoid}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[Archetype.Warrior, Archetype.Healer, Archetype.Sage, Archetype.Creator].map((arch) => (
                <button
                  key={arch}
                  onClick={() => setFormData({ ...formData, archetype: arch })}
                  className={`group relative h-32 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] ${
                    formData.archetype === arch
                      ? 'bg-gradient-to-br from-amber-500/20 to-purple-900/40 border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`text-4xl drop-shadow-md transition-transform duration-500 ${formData.archetype === arch ? 'scale-110' : 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'}`}>
                    {ARCHETYPE_ICONS[arch]}
                  </div>
                  <span className={`font-mystic text-xs uppercase tracking-[0.2em] block ${formData.archetype === arch ? 'text-amber-100' : 'text-purple-200/60'}`}>
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
          <div className="space-y-6 animate-[slideUp_0.4s_ease-out] text-center pt-2">
            <div>
                <h2 className="text-2xl font-mystic text-amber-100">{t.currentState}</h2>
                <p className="text-purple-200/60 text-[10px] mt-1 uppercase tracking-widest">{t.spiritResonate}</p>
            </div>
            
            <div className="flex flex-col gap-3">
              {[Feeling.Lost, Feeling.Energetic, Feeling.SeekingLove, Feeling.FocusOnMoney].map((feelingKey) => (
                <button
                  key={feelingKey}
                  onClick={() => setFormData({ ...formData, feeling: feelingKey })}
                  className={`group relative p-4 rounded-xl border flex items-center gap-4 transition-all duration-300 ${
                    formData.feeling === feelingKey
                      ? 'bg-gradient-to-r from-amber-900/40 to-purple-900/40 border-amber-400/50 shadow-md translate-x-1'
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full border text-xl transition-colors ${formData.feeling === feelingKey ? 'bg-amber-500/20 border-amber-400/50' : 'bg-black/30 border-white/10'}`}>
                     {FEELING_ICONS[feelingKey]}
                  </div>
                  <span className={`font-mystic text-sm tracking-[0.1em] uppercase ${formData.feeling === feelingKey ? 'text-amber-100' : 'text-gray-300'}`}>
                    {t[feelingKey]}
                  </span>
                  
                  <div className={`ml-auto w-3 h-3 rounded-full transition-all duration-300 ${formData.feeling === feelingKey ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]' : 'bg-transparent border border-white/20'}`}></div>
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!formData.feeling}
              className={`w-full py-4 mt-2 rounded-xl font-mystic tracking-[0.25em] text-sm uppercase transition-all duration-500 ${
                formData.feeling
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.6)] border border-amber-400/30'
                  : 'bg-gray-800/50 text-gray-500 cursor-not-allowed border border-white/5'
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
    <div className="pt-2 animate-[fadeIn_0.5s_ease-out]">
        <button 
        onClick={onClick} 
        className="text-xs font-mystic uppercase tracking-[0.2em] text-amber-200/80 border-b border-amber-200/30 hover:text-white hover:border-white pb-1 transition-all"
        >
        {text}
        </button>
    </div>
);