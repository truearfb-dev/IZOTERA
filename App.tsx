import { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { MagicLoader } from './components/MagicLoader';
import { NatalCard } from './components/NatalCard';
import { UserData, DailyPrediction, Language } from './types';
import { generatePrediction } from './utils/astrology';

enum AppState {
  Onboarding,
  Loading,
  Result
}

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.Onboarding);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [prediction, setPrediction] = useState<DailyPrediction | null>(null);
  const [lang, setLang] = useState<Language>('en');

  const handleOnboardingComplete = (data: UserData) => {
    setUserData(data);
    setAppState(AppState.Loading);
  };

  useEffect(() => {
    if (appState === AppState.Loading && userData) {
      const fetchPrediction = async () => {
        try {
          const result = await generatePrediction(userData, lang);
          setPrediction(result);
          setAppState(AppState.Result);
        } catch (error) {
          console.error("Failed to generate prediction:", error);
          setAppState(AppState.Onboarding);
        }
      };
      
      fetchPrediction();
    }
  }, [appState, userData, lang]);

  // Re-generate prediction if language changes while looking at result
  useEffect(() => {
    if (appState === AppState.Result && userData) {
       setAppState(AppState.Loading);
    }
  }, [lang]);

  const handleReset = () => {
    setAppState(AppState.Onboarding);
    setUserData(null);
    setPrediction(null);
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col">
      {/* Persistent "Stars" background is in index.html, adding a vignette here */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#0f0c29_90%)] z-0"></div>

      <header className="relative z-10 p-6 flex justify-between items-center">
        <div className="w-16"></div> {/* Spacer for centering */}
        <h1 className="text-2xl md:text-3xl font-mystic tracking-[0.5em] text-amber-500/80 uppercase text-center">
          Aetheria
        </h1>
        <div className="w-16 flex justify-end gap-2">
            <button 
                onClick={() => setLang('en')} 
                className={`text-2xl hover:scale-110 transition-transform ${lang === 'en' ? 'opacity-100' : 'opacity-40 grayscale hover:grayscale-0'}`}
                title="English"
            >
                🇺🇸
            </button>
            <button 
                onClick={() => setLang('ru')} 
                className={`text-2xl hover:scale-110 transition-transform ${lang === 'ru' ? 'opacity-100' : 'opacity-40 grayscale hover:grayscale-0'}`}
                title="Русский"
            >
                🇷🇺
            </button>
        </div>
      </header>

      <main className="relative z-10 flex-grow flex items-center justify-center p-4">
        {appState === AppState.Onboarding && (
          <Onboarding lang={lang} onComplete={handleOnboardingComplete} />
        )}
        
        {appState === AppState.Loading && (
          <MagicLoader lang={lang} />
        )}
        
        {appState === AppState.Result && userData && prediction && (
          <NatalCard 
            data={prediction} 
            userData={userData}
            lang={lang}
            onReset={handleReset} 
          />
        )}
      </main>
      
      <footer className="relative z-10 p-4 text-center text-purple-900/40 text-xs font-serif">
        &copy; {new Date().getFullYear()} Cosmic Alignments. Deterministic Logic Engine.
      </footer>
    </div>
  );
}