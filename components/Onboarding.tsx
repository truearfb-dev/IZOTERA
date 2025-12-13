import React, { useState } from 'react';
import { UserData, Feeling, Language, Element, Archetype } from '../types';
import { calculateZodiac } from '../utils/astrology';
import { TRANSLATIONS, FEELING_ICONS, ZODIAC_NAMES, ELEMENT_ICONS, ARCHETYPE_ICONS } from '../constants';

interface Props {
  lang: Language;
  onComplete: (data: UserData) => void;
}

export const Onboarding: React.FC<Props> = ({ lang, onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserData>>({
    name: '',
    dob: '',
    tob: '',
    element: null,
    archetype: null,
    feeling: null,
  });

  const t = TRANSLATIONS[lang];

  const handleNext = () => {
    if (step === 1 && formData.dob) {
      const sign = calculateZodiac(formData.dob);
      setFormData(prev => ({ ...prev, zodiacSign: sign }));
    }
    setStep(prev => prev + 1);
  };

  const handleSubmit = () => {
    if (formData.name && formData.dob && formData.feeling && formData.element && formData.archetype) {
      onComplete(formData as UserData);
    }
  };

  const isStep1Valid = formData.name && formData.dob;
  const isStep2Valid = formData.tob;

  return (
    <div className="w-full max-w-md mx-auto p-6 min-h-[500px] flex flex-col justify-center animate-[fadeIn_1s_ease-out]">
      <div className="glass-panel rounded-2xl p-8 shadow-2xl relative overflow-hidden transition-all duration-500">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
        
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-6">
           {[1, 2, 3, 4, 5].map(i => (
             <div key={i} className={`w-2 h-2 rounded-full transition-colors duration-300 ${step >= i ? 'bg-amber-400' : 'bg-purple-900'}`}></div>
           ))}
        </div>

        {/* Step 1: Identity */}
        {step === 1 && (
          <div className="space-y-6 animate-[slideUp_0.5s_ease-out]">
            <h2 className="text-3xl font-mystic text-center text-amber-100 mb-2">{t.identifyYourself}</h2>
            <p className="text-center text-purple-200 text-sm italic">{t.starsNeedName}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-purple-300 mb-1">{t.nameLabel}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/30 border border-purple-500/30 rounded p-3 text-white focus:border-amber-400 focus:outline-none transition-colors"
                  placeholder={t.namePlaceholder}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-purple-300 mb-1">{t.dobLabel}</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full bg-black/30 border border-purple-500/30 rounded p-3 text-white focus:border-amber-400 focus:outline-none transition-colors [color-scheme:dark]"
                />
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!isStep1Valid}
              className={`w-full py-3 mt-4 rounded-lg font-mystic tracking-widest transition-all duration-300 ${
                isStep1Valid 
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-800 text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]' 
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t.revealSigns}
            </button>
          </div>
        )}

        {/* Step 2: Time */}
        {step === 2 && (
          <div className="space-y-6 animate-[slideUp_0.5s_ease-out]">
            <h2 className="text-3xl font-mystic text-center text-amber-100 mb-2">{t.preciseMoment}</h2>
            <p className="text-center text-purple-200 text-sm italic">{t.calculateAscendant}</p>
            
            <div className="space-y-4">
              <div className="text-center text-amber-200 font-bold text-lg">
                {formData.zodiacSign ? ZODIAC_NAMES[lang][formData.zodiacSign] : ''} {t.sunDetected}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-purple-300 mb-1">{t.tobLabel}</label>
                <input
                  type="time"
                  value={formData.tob}
                  onChange={e => setFormData({ ...formData, tob: e.target.value })}
                  className="w-full bg-black/30 border border-purple-500/30 rounded p-3 text-white focus:border-amber-400 focus:outline-none transition-colors [color-scheme:dark]"
                />
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!isStep2Valid}
              className={`w-full py-3 mt-4 rounded-lg font-mystic tracking-widest transition-all duration-300 ${
                isStep2Valid
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-800 text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t.continue}
            </button>
          </div>
        )}

        {/* Step 3: Elements */}
        {step === 3 && (
          <div className="space-y-6 animate-[slideUp_0.5s_ease-out]">
            <h2 className="text-3xl font-mystic text-center text-amber-100 mb-2">{t.elementalCore}</h2>
            <p className="text-center text-purple-200 text-sm italic">{t.forceGov}</p>
            
            <div className="grid grid-cols-2 gap-3">
              {[Element.Fire, Element.Water, Element.Air, Element.Earth].map((el) => (
                <button
                  key={el}
                  onClick={() => setFormData({ ...formData, element: el })}
                  className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-all duration-300 ${
                    formData.element === el
                      ? 'bg-purple-900/50 border-amber-400 text-amber-100 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                      : 'bg-black/20 border-purple-500/20 text-purple-200 hover:bg-purple-900/30 hover:border-purple-500/50'
                  }`}
                >
                  <span className="text-2xl">{ELEMENT_ICONS[el]}</span>
                  <span className="font-mystic text-sm text-center">{t[el]}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!formData.element}
              className={`w-full py-3 mt-4 rounded-lg font-mystic tracking-widest transition-all duration-300 ${
                formData.element
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-800 text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t.continue}
            </button>
          </div>
        )}

        {/* Step 4: Archetype */}
        {step === 4 && (
          <div className="space-y-6 animate-[slideUp_0.5s_ease-out]">
            <h2 className="text-3xl font-mystic text-center text-amber-100 mb-2">{t.theMirror}</h2>
            <p className="text-center text-purple-200 text-sm italic">{t.mirrorVoid}</p>
            
            <div className="grid grid-cols-2 gap-3">
              {[Archetype.Warrior, Archetype.Healer, Archetype.Sage, Archetype.Creator].map((arch) => (
                <button
                  key={arch}
                  onClick={() => setFormData({ ...formData, archetype: arch })}
                  className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-all duration-300 ${
                    formData.archetype === arch
                      ? 'bg-purple-900/50 border-amber-400 text-amber-100 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                      : 'bg-black/20 border-purple-500/20 text-purple-200 hover:bg-purple-900/30 hover:border-purple-500/50'
                  }`}
                >
                  <span className="text-2xl">{ARCHETYPE_ICONS[arch]}</span>
                  <span className="font-mystic text-sm text-center">{t[arch]}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!formData.archetype}
              className={`w-full py-3 mt-4 rounded-lg font-mystic tracking-widest transition-all duration-300 ${
                formData.archetype
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-800 text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t.continue}
            </button>
          </div>
        )}

        {/* Step 5: Feeling */}
        {step === 5 && (
          <div className="space-y-6 animate-[slideUp_0.5s_ease-out]">
            <h2 className="text-3xl font-mystic text-center text-amber-100 mb-2">{t.currentState}</h2>
            <p className="text-center text-purple-200 text-sm italic">{t.spiritResonate}</p>
            
            <div className="grid grid-cols-1 gap-3">
              {[Feeling.Lost, Feeling.Energetic, Feeling.SeekingLove, Feeling.FocusOnMoney].map((feelingKey) => (
                <button
                  key={feelingKey}
                  onClick={() => setFormData({ ...formData, feeling: feelingKey })}
                  className={`p-4 rounded-lg border flex items-center gap-4 transition-all duration-300 text-left ${
                    formData.feeling === feelingKey
                      ? 'bg-purple-900/50 border-amber-400 text-amber-100 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                      : 'bg-black/20 border-purple-500/20 text-purple-200 hover:bg-purple-900/30 hover:border-purple-500/50'
                  }`}
                >
                  <span className="text-2xl">{FEELING_ICONS[feelingKey]}</span>
                  <span className="font-mystic text-lg">{t[feelingKey]}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!formData.feeling}
              className={`w-full py-3 mt-4 rounded-lg font-mystic tracking-widest transition-all duration-300 ${
                formData.feeling
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-700 text-white hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]'
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