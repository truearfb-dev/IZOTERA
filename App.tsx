import { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { MagicLoader } from './components/MagicLoader';
import { NatalCard } from './components/NatalCard';
import { InstallPrompt } from './components/InstallPrompt';
import { UserData, DailyPrediction } from './types';
import { generatePrediction } from './utils/astrology';

enum AppState {
  Onboarding,
  Loading,
  Result,
  Error
}

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.Onboarding);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [prediction, setPrediction] = useState<DailyPrediction | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleOnboardingComplete = (data: UserData) => {
    setUserData(data);
    setAppState(AppState.Loading);
  };

  useEffect(() => {
    if (appState === AppState.Loading && userData) {
      const fetchPrediction = async () => {
        try {
          const result = await generatePrediction(userData);
          setPrediction(result);
          setAppState(AppState.Result);
        } catch (error: any) {
          console.error("Failed to generate prediction:", error);
          setErrorMessage(error.message || "Космическая связь была прервана.");
          setAppState(AppState.Error);
        }
      };
      
      fetchPrediction();
    }
  }, [appState, userData]);

  const handleReset = () => {
    setAppState(AppState.Onboarding);
    setUserData(null);
    setPrediction(null);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col">
      {/* Persistent "Stars" background is in index.html, adding a vignette here */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#0f0c29_90%)] z-0"></div>

      <header className="relative z-10 p-6 flex justify-center items-center">
        <h1 className="text-2xl md:text-4xl font-mystic tracking-[0.5em] text-amber-500/80 uppercase text-center drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
          Aetheria
        </h1>
      </header>

      <main className="relative z-10 flex-grow flex items-center justify-center p-4 pb-24">
        {appState === AppState.Onboarding && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
        
        {appState === AppState.Loading && (
          <MagicLoader />
        )}
        
        {appState === AppState.Result && userData && prediction && (
          <NatalCard 
            data={prediction} 
            userData={userData}
            onReset={handleReset} 
          />
        )}

        {appState === AppState.Error && (
          <div className="w-full max-w-md mx-auto p-6 animate-[fadeIn_1s_ease-out]">
            <div className="glass-panel rounded-2xl p-8 shadow-2xl text-center border-red-500/20 bg-red-900/10">
               <div className="text-4xl mb-4">🌑</div>
               <h2 className="text-2xl font-mystic text-red-200 mb-4 uppercase tracking-widest">
                 Космические Помехи
               </h2>
               <p className="text-purple-200 mb-6 font-serif italic">
                 {errorMessage}
               </p>
               <button 
                 onClick={handleReset}
                 className="px-8 py-3 rounded-lg font-mystic tracking-widest bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all border border-white/10"
               >
                 Попробовать снова
               </button>
            </div>
          </div>
        )}
      </main>
      
      {/* Install Prompt Button */}
      <InstallPrompt />
      
      <footer className="relative z-10 p-4 text-center text-purple-900/40 text-xs font-serif">
        &copy; {new Date().getFullYear()} Cosmic Alignments. Deterministic Logic Engine.
      </footer>
    </div>
  );
}