import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Onboarding } from './components/Onboarding';
import { MagicLoader } from './components/MagicLoader';
import { NatalCard } from './components/NatalCard';
import { InstallPrompt } from './components/InstallPrompt';
import { Paywall } from './components/Paywall';
import { AuthModal } from './components/AuthModal';
import { UserData, DailyPrediction } from './types';
import { generatePrediction } from './utils/astrology';

enum AppState {
  SetupRequired, // New state for missing keys
  Onboarding,
  Auth,
  Paywall,
  Loading,
  Result,
  Error
}

const MAX_FREE_PREDICTIONS = 3;

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.Onboarding);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [prediction, setPrediction] = useState<DailyPrediction | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Supabase State
  const [session, setSession] = useState<any>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Check for Env Vars on mount
  useEffect(() => {
    const hasSupabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!hasSupabase) {
      setAppState(AppState.SetupRequired);
    }
  }, []);

  // Initialize Session
  useEffect(() => {
    if (appState === AppState.SetupRequired) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [appState]);

  // Fetch Profile when Session Changes
  useEffect(() => {
    if (session) {
      fetchProfile();
    } else {
      setUsageCount(0);
      setIsPremium(false);
    }
  }, [session]);

  // Safety Timeout for Loading State
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (appState === AppState.Loading) {
      // If stuck in loading for more than 25 seconds, force error
      timeout = setTimeout(() => {
        setErrorMessage("Ответ вселенной задерживается. Пожалуйста, проверьте соединение или попробуйте снова.");
        setAppState(AppState.Error);
      }, 25000);
    }
    return () => clearTimeout(timeout);
  }, [appState]);

  const fetchProfile = async () => {
    if (!session) return;
    setIsLoadingProfile(true);
    try {
      let { data, error } = await supabase
        .from('profiles')
        .select('free_usage_count, is_premium')
        .eq('id', session.user.id)
        .single();
      
      // Self-healing: If profile missing (PGRST116), try to create it manually
      if (error && error.code === 'PGRST116') {
         console.log("Profile missing, attempting fallback creation...");
         const { data: newData, error: insertError } = await supabase
            .from('profiles')
            .insert([{ id: session.user.id, free_usage_count: 0, is_premium: false }])
            .select()
            .single();
            
         if (!insertError && newData) {
             data = newData;
             error = null;
         }
      }
        
      if (error) {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setUsageCount(data.free_usage_count || 0);
        setIsPremium(data.is_premium || false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleOnboardingComplete = (data: UserData) => {
    setUserData(data);
    if (!session) {
      setAppState(AppState.Auth);
    } else {
      checkLimitsAndProceed();
    }
  };

  const checkLimitsAndProceed = () => {
    if (isLoadingProfile) return;
    
    if (!isPremium && usageCount >= MAX_FREE_PREDICTIONS) {
      setAppState(AppState.Paywall);
    } else {
      setAppState(AppState.Loading);
    }
  };

  const handleAuthSuccess = async () => {
    await fetchProfile();
    if (userData) {
      checkLimitsAndProceed();
    } else {
      setAppState(AppState.Onboarding);
    }
  };

  const handleUnlockPremium = async () => {
    setIsPremium(true); 
    if (userData) {
      setAppState(AppState.Loading);
    } else {
      setAppState(AppState.Onboarding);
    }
  };

  // Main Generation Effect
  useEffect(() => {
    if (appState === AppState.Loading && userData && session) {
      const fetchPrediction = async () => {
        try {
          console.log("Starting prediction generation...");
          const result = await generatePrediction(userData);
          console.log("Prediction generated successfully");
          setPrediction(result);
          setAppState(AppState.Result);
          
          if (!isPremium) {
            const newCount = usageCount + 1;
            setUsageCount(newCount);
            
            // Optimistic update locally
            await supabase
              .from('profiles')
              .update({ free_usage_count: newCount })
              .eq('id', session.user.id);
          }
          
        } catch (error: any) {
          console.error("Failed to generate prediction:", error);
          setErrorMessage(error.message || "Космическая связь была прервана.");
          setAppState(AppState.Error);
        }
      };
      
      fetchPrediction();
    } else if (appState === AppState.Loading && !userData) {
        // Edge case: Loading state but data lost (e.g. refresh)
        console.warn("Loading state active but userData is missing. Resetting to Onboarding.");
        setAppState(AppState.Onboarding);
    }
  }, [appState, userData, session, isPremium]);

  const handleReset = () => {
    setAppState(AppState.Onboarding);
    setUserData(null);
    setPrediction(null);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#0f0c29_90%)] z-0"></div>

      <header className="relative z-10 p-6 flex justify-between items-center max-w-4xl mx-auto w-full">
        <h1 className="text-2xl md:text-3xl font-mystic tracking-[0.3em] text-amber-500/80 uppercase drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
          Aetheria
        </h1>
        
        {session && (
          <div className="flex items-center gap-4">
             {!isPremium && (
               <div className="text-[10px] text-purple-300/50 uppercase tracking-widest border border-purple-500/20 px-2 py-1 rounded-full">
                 {usageCount}/{MAX_FREE_PREDICTIONS} Free
               </div>
             )}
             <button 
               onClick={() => {
                 supabase.auth.signOut(); 
                 setAppState(AppState.Onboarding);
                 setUserData(null);
               }}
               className="text-xs text-white/40 hover:text-white transition-colors"
             >
               Выйти
             </button>
          </div>
        )}
      </header>

      <main className="relative z-10 flex-grow flex items-center justify-center p-4 pb-24">
        {appState === AppState.SetupRequired && (
          <div className="glass-panel p-8 rounded-2xl max-w-md text-center border-amber-500/30">
            <div className="text-4xl mb-4">⚙️</div>
            <h2 className="text-xl font-mystic text-amber-100 mb-4">Требуется Настройка</h2>
            <p className="text-purple-200 text-sm mb-4">
              Приложение не видит ключи доступа к базе данных и AI.
            </p>
            <div className="text-left bg-black/30 p-4 rounded text-xs font-mono text-gray-400 mb-4">
              1. Создайте файл <strong>.env</strong><br/>
              2. Скопируйте содержимое из <strong>env.example</strong><br/>
              3. Вставьте свои ключи.<br/>
              4. Перезапустите терминал.
            </div>
            <p className="text-xs text-amber-500/50 uppercase tracking-widest">Ожидание конфигурации...</p>
          </div>
        )}

        {appState === AppState.Onboarding && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
        
        {appState === AppState.Auth && (
          <AuthModal onSuccess={handleAuthSuccess} />
        )}
        
        {appState === AppState.Paywall && (
          <Paywall onUnlock={handleUnlockPremium} />
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
      
      <InstallPrompt />
      
      <footer className="relative z-10 p-4 text-center text-purple-900/40 text-xs font-serif">
        &copy; {new Date().getFullYear()} Cosmic Alignments. Deterministic Logic Engine.
      </footer>
    </div>
  );
}