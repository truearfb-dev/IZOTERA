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
    // Auto-capitalize first letter
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
    <div className="w-full max-w-md mx-auto p-4 min-h-[600px] flex flex-col justify-center animate-[fadeIn_0.8s_ease-out]">
      <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-[0_0_30px_-5px_rgba(48,43,99,0.5)] relative overflow-hidden transition-all duration-500 border border-white/5">
        
        {/* Progress Bar */}
        <div className="flex justify-center gap-3 mb-8">
           {[1, 2, 3, 4, 5].map(i => (
             <div 
               key={i} 
               className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'w-2 bg-white/10'}`}
             ></div>
           ))}
        </div>

        {/* Step 1: Identity & Intro */}
        {step === 1 && (
          <div className="space-y-8 animate-[slideUp_0.5s_ease-out] text-center">
            
            {/* Description / Hero Section */}
            <div className="border-b border-white/5 pb-6">
                <h2 className="text-2xl font-mystic text-amber-100 mb-3">{t.identifyYourself}</h2>
                <p className="text-purple-200 text-sm italic leading-relaxed opacity-90">
                  {t.starsNeedName}
                </p>
            </div>
            
            <div className="space-y-6">
              <div className="relative group">
                <label className="block text-xs uppercase tracking-[0.2em] text-purple-300 mb-2">{t.nameLabel}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-center text-xl text-amber-50 font-mystic focus:border-amber-400/50 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(251,191,36,0.1)] focus:outline-none transition-all placeholder:text-white/20"
                  placeholder={t.namePlaceholder}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-purple-300 mb-2">{t.dobLabel}</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-center text-xl text-amber-50 font-mystic focus:border-amber-400/50 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(251,191,36,0.1)] focus:outline-none transition-all [color-scheme:dark]"
                />
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!isStep1Valid}
              className={`w-full py-4 mt-6 rounded-xl font-mystic tracking-[0.2em] uppercase transition-all duration-300 transform hover:-translate-y-1 ${
                isStep1Valid 
                  ? 'bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-500/30 text-white shadow-[0_0_20px_rgba(88,28,135,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]' 
                  : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
              }`}
            >
              {t.revealSigns}
            </button>
          </div>
        )}

        {/* Step 2: Time */}
        {step === 2 && (
          <div className="space-y-8 animate-[slideUp_0.5s_ease-out] text-center">
            <div>
                <h2 className="text-3xl font-mystic text-amber-100 mb-2">{t.preciseMoment}</h2>
                <p className="text-purple-200 text-sm italic opacity-80">{t.calculateAscendant}</p>
            </div>
            
            <div className="space-y-6">
              <div className="inline-block px-6 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-200 font-mystic tracking-widest text-sm shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                {formData.zodiacSign ? ZODIAC_NAMES[formData.zodiacSign] : ''} • {t.sunDetected}
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-purple-300 mb-2">{t.tobLabel}</label>
                <input
                  type="time"
                  value={formData.tob}
                  onChange={e => setFormData({ ...formData, tob: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-center text-2xl text-amber-50 font-mystic focus:border-amber-400/50 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(251,191,36,0.1)] focus:outline-none transition-all [color-scheme:dark]"
                />
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!isStep2Valid}
              className={`w-full py-4 mt-6 rounded-xl font-mystic tracking-[0.2em] uppercase transition-all duration-300 transform hover:-translate-y-1 ${
                isStep2Valid
                  ? 'bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-500/30 text-white shadow-[0_0_20px_rgba(88,28,135,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]'
                  : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
              }`}
            >
              {t.continue}
            </button>
          </div>
        )}

        {/* Step 3: Elements */}
        {step === 3 && (
          <div className="space-y-6 animate-[slideUp_0.5s_ease-out] text-center">
            <div>
                <h2 className="text-3xl font-mystic text-amber-100 mb-2">{t.elementalCore}</h2>
                <p className="text-purple-200 text-sm italic opacity-80">{t.forceGov}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[Element.Fire, Element.Water, Element.Air, Element.Earth].map((el) => (
                <button
                  key={el}
                  onClick={() => setFormData({ ...formData, element: el })}
                  className={`group relative p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all duration-500 overflow-hidden ${
                    formData.element === el
                      ? 'bg-amber-500/10 border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.2)]'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`text-3xl transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]`}>
                    {ELEMENT_ICONS[el]}
                  </div>
                  <div className="space-y-1">
                      <span className={`font-mystic text-sm uppercase tracking-widest block ${formData.element === el ? 'text-amber-100' : 'text-purple-200'}`}>
                        {t[el]}
                      </span>
                      <span className="text-[10px] text-white/40 font-serif italic block">
                        {t.elementDesc[el]}
                      </span>
                  </div>
                  
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Archetype */}
        {step === 4 && (
          <div className="space-y-6 animate-[slideUp_0.5s_ease-out] text-center">
            <div>
                <h2 className="text-3xl font-mystic text-amber-100 mb-2">{t.theMirror}</h2>
                <p className="text-purple-200 text-sm italic opacity-80">{t.mirrorVoid}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[Archetype.Warrior, Archetype.Healer, Archetype.Sage, Archetype.Creator].map((arch) => (
                <button
                  key={arch}
                  onClick={() => setFormData({ ...formData, archetype: arch })}
                  className={`group relative p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all duration-500 overflow-hidden ${
                    formData.archetype === arch
                      ? 'bg-amber-500/10 border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.2)]'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`text-3xl transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]`}>
                    {ARCHETYPE_ICONS[arch]}
                  </div>
                  <div className="space-y-1">
                      <span className={`font-mystic text-sm uppercase tracking-widest block ${formData.archetype === arch ? 'text-amber-100' : 'text-purple-200'}`}>
                        {t[arch]}
                      </span>
                      <span className="text-[10px] text-white/40 font-serif italic block">
                        {t.archetypeDesc[arch]}
                      </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Feeling */}
        {step === 5 && (
          <div className="space-y-6 animate-[slideUp_0.5s_ease-out] text-center">
            <div>
                <h2 className="text-3xl font-mystic text-amber-100 mb-2">{t.currentState}</h2>
                <p className="text-purple-200 text-sm italic opacity-80">{t.spiritResonate}</p>
            </div>
            
            <div className="flex flex-col gap-3">
              {[Feeling.Lost, Feeling.Energetic, Feeling.SeekingLove, Feeling.FocusOnMoney].map((feelingKey) => (
                <button
                  key={feelingKey}
                  onClick={() => setFormData({ ...formData, feeling: feelingKey })}
                  className={`group relative p-4 rounded-xl border flex items-center gap-4 transition-all duration-500 overflow-hidden ${
                    formData.feeling === feelingKey
                      ? 'bg-amber-500/10 border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.2)]'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 border border-white/10 text-xl group-hover:scale-110 transition-transform">
                     {FEELING_ICONS[feelingKey]}
                  </div>
                  <span className={`font-mystic text-lg tracking-wide ${formData.feeling === feelingKey ? 'text-amber-100' : 'text-gray-300'}`}>
                    {t[feelingKey]}
                  </span>
                  
                  {/* Selection indicator */}
                  <div className={`ml-auto w-3 h-3 rounded-full transition-all duration-300 ${formData.feeling === feelingKey ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,1)]' : 'bg-transparent border border-white/20'}`}></div>
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!formData.feeling}
              className={`w-full py-4 mt-6 rounded-xl font-mystic tracking-[0.2em] uppercase transition-all duration-300 transform hover:-translate-y-1 ${
                formData.feeling
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-700 text-white shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:shadow-[0_0_40px_rgba(245,158,11,0.7)] border border-amber-500/30'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t.consultStars}
            </button>
          </div>
        )}
      </div>
      
      {/* Navigation for steps 3 & 4 handled by effect or auto-advance? No, user must click choice. 
          The Onboarding logic auto-advances if I add the onClick handlers to the buttons themselves 
          or keep the "Continue" button. 
          
          For better UX on mobile, let's auto-advance when a choice is made for Elements and Archetypes 
          after a small delay to see the selection animation.
      */}
      {(step === 3 || step === 4) && (
           <div className="mt-4 text-center">
             <button 
                onClick={handleNext} 
                disabled={step === 3 ? !formData.element : !formData.archetype}
                className={`text-sm font-mystic uppercase tracking-widest transition-opacity duration-300 border-b border-transparent hover:border-amber-400 ${
                    (step === 3 && formData.element) || (step === 4 && formData.archetype) ? 'text-amber-200 opacity-100' : 'text-gray-600 opacity-0 pointer-events-none'
                }`}
             >
                {t.continue}
             </button>
           </div>
      )}
    </div>
  );
};