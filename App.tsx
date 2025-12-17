import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Onboarding } from './components/Onboarding';
import { MagicLoader } from './components/MagicLoader';
import { NatalCard } from './components/NatalCard';
import { InstallPrompt } from './components/InstallPrompt';
import { Paywall } from './components/Paywall';
import { AuthModal } from './components/AuthModal';
import { HistoryView } from './components/HistoryView';
import { UserData, DailyPrediction } from './types';
import { generatePrediction } from './utils/astrology';
import { playSound } from './utils/sounds';
import { TRANSLATIONS } from './constants';

enum AppState {
  SetupRequired,
  Onboarding,
  Auth,
  Paywall,
  Loading,
  Result,
  Error,
  History
}

const MAX_FREE_PREDICTIONS = 3;
const GUEST_ID = 'guest-session';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.Onboarding);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [prediction, setPrediction] = useState<DailyPrediction | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // History State
  const [history, setHistory] = useState<{date: string, prediction: DailyPrediction}[]>([]);
  
  // Supabase State
  const [session, setSession] = useState<any>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Check for Env Vars on mount
  useEffect(() => {
    // Check for both standard Vite env vars and the polyfilled process.env
    const hasSupabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    const hasGemini = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
    
    if (!hasSupabase || !hasGemini) {
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
      loadHistory();
    } else {
      setUsageCount(0);
      setIsPremium(false);
      // Load local history for guest/unauth
      const local = localStorage.getItem('aetheria_history');
      if (local) setHistory(JSON.parse(local));
    }
  }, [session]);

  const loadHistory = () => {
    // For now, we sync with local storage for simplicity in this demo environment, 
    // but in production this would query a 'predictions' table.
    // If we had the table: const { data } = await supabase.from('predictions').select('*').eq('user_id', session.user.id);
    const local = localStorage.getItem(`history_${session?.user?.id || 'guest'}`);
    if (local) setHistory(JSON.parse(local));
  };

  const saveToHistory = (pred: DailyPrediction) => {
    const newItem = { date: new Date().toISOString(), prediction: pred };
    const newHistory = [newItem, ...history];
    setHistory(newHistory);
    
    // Save locally
    const key = session ? `history_${session.user.id}` : 'aetheria_history';
    localStorage.setItem(key, JSON.stringify(newHistory));
  };

  // Safety Timeout for Loading State
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (appState === AppState.Loading) {
      // If stuck in loading for more than 60 seconds (increased from 25), force error
      timeout = setTimeout(() => {
        setErrorMessage("Звезды сегодня задумчивы. Время ожидания истекло.");
        setAppState(AppState.Error);
      }, 60000);
    }
    return () => clearTimeout(timeout);
  }, [appState]);

  const fetchProfile = async () => {
    if (!session) return;
    
    // Guest bypass
    if (session.user.id === GUEST_ID) {
      setUsageCount(0);
      setIsPremium(false);
      return;
    }

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
    playSound('click');
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
    playSound('success');
    await fetchProfile();
    if (userData) {
      checkLimitsAndProceed();
    } else {
      setAppState(AppState.Onboarding);
    }
  };
  
  const handleGuestAccess = () => {
    playSound('click');
    // Create a fake session for Guest Mode
    const guestSession = {
      user: { id: GUEST_ID, email: 'guest@aetheria.void' },
      access_token: 'guest-token',
    };
    setSession(guestSession);
    // Proceed immediately
    if (userData) {
       setAppState(AppState.Loading);
    }
  };

  const handleUnlockPremium = async () => {
    playSound('success');
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
          playSound('reveal');
          const result = await generatePrediction(userData);
          console.log("Prediction generated successfully");
          setPrediction(result);
          saveToHistory(result); // Save to log
          setAppState(AppState.Result);
          
          // Only update DB if it's a real user, not a guest
          if (!isPremium && session.user.id !== GUEST_ID) {
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

  const handleRetry = () => {
    setErrorMessage('');
    setAppState(AppState.Loading);
  };
  
  const handleOpenHistory = () => {
      playSound('click');
      setAppState(AppState.History);
  };

  const handleHistorySelect = (pred: DailyPrediction) => {
      setPrediction(pred);
      // Need userData to be valid to show NatalCard? 
      // Ideally we store userData with history too, but for now we'll mock it if missing or rely on current.
      if (!userData) {
          setUserData({ name: "Traveler", dob: "", tob: "", element: null, archetype: null, feeling: null }); 
      }
      setAppState(AppState.Result);
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col overflow-hidden">
      {/* RESTORED BACKGROUND LAYERS */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#0f0c29_90%)] z-0"></div>
      <div className="stars fixed inset-0 pointer-events-none z-0"></div>
      <div className="stars2 fixed inset-0 pointer-events-none z-0"></div>
      
      <header className="relative z-10 p-6 flex justify-between items-center max-w-4xl mx-auto w-full">
        <h1 
            onClick={() => { playSound('hover'); handleReset(); }}
            className="text-2xl md:text-3xl font-mystic tracking-[0.3em] text-amber-500/80 uppercase drop-shadow-[0_0_10px_rgba(245,158,11,0.3)] cursor-pointer hover:text-amber-400 transition-colors"
        >
          Aetheria
        </h1>
        
        {session && (
          <div className="flex items-center gap-4">
             {/* History Button */}
             {appState !== AppState.History && (
                 <button 
                    onClick={handleOpenHistory}
                    className="text-xs text-amber-200/50 hover:text-amber-100 transition-colors uppercase tracking-widest flex items-center gap-1"
                 >
                    <span className="text-lg">📜</span> <span className="hidden md:inline">{TRANSLATIONS.openHistory}</span>
                 </button>
             )}
          
             {!isPremium && session.user.id !== GUEST_ID && (
               <div className="hidden md:block text-[10px] text-purple-300/50 uppercase tracking-widest border border-purple-500/20 px-2 py-1 rounded-full">
                 {usageCount}/{MAX_FREE_PREDICTIONS} Free
               </div>
             )}
             {session.user.id === GUEST_ID && (
               <div className="hidden md:block text-[10px] text-amber-300/50 uppercase tracking-widest border border-amber-500/20 px-2 py-1 rounded-full">
                 Guest
               </div>
             )}
             <button 
               onClick={() => {
                 playSound('click');
                 if (session.user.id !== GUEST_ID) {
                    supabase.auth.signOut(); 
                 }
                 setSession(null);
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

      <main className="relative z-10 flex-grow flex items-center justify-center p-4 pb-24 w-full">
        {appState === AppState.SetupRequired && (
          <div className="glass-panel p-8 rounded-2xl max-w-md text-center border-amber-500/30 animate-[fadeIn_0.5s_ease-out]">
            <div className="text-4xl mb-4">⚙️</div>
            <h2 className="text-xl font-mystic text-amber-100 mb-4">Настройка Вселенной</h2>
            <p className="text-purple-200 text-sm mb-6">
              Приложение не может подключиться к энергетическим потокам.
            </p>
            
            <div className="text-left space-y-4">
              <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                <p className="text-xs uppercase text-amber-500/70 mb-2 font-bold tracking-wider">Vercel Configuration</p>
                <p className="text-xs text-gray-400 font-mono mb-2">
                   Убедитесь, что переменная называется <code>VITE_GEMINI_API_KEY</code>.
                </p>
                <ul className="text-[10px] text-gray-500 font-mono list-disc list-inside">
                  <li>VITE_SUPABASE_URL</li>
                  <li>VITE_SUPABASE_ANON_KEY</li>
                  <li className="text-amber-300">VITE_GEMINI_API_KEY</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {appState === AppState.Onboarding && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
        
        {appState === AppState.Auth && (
          <AuthModal 
            onSuccess={handleAuthSuccess} 
            onGuestAccess={handleGuestAccess}
          />
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
        
        {appState === AppState.History && (
          <HistoryView 
            history={history}
            onSelect={handleHistorySelect}
            onBack={() => setAppState(userData && prediction ? AppState.Result : AppState.Onboarding)}
          />
        )}

        {appState === AppState.Error && (
          <div className="w-full max-w-md mx-auto p-6 animate-[fadeIn_1s_ease-out]">
            <div className="glass-panel rounded-2xl p-8 shadow-2xl text-center border-red-500/20 bg-red-900/10">
               <div className="text-4xl mb-4">🌑</div>
               <h2 className="text-2xl font-mystic text-red-200 mb-4 uppercase tracking-widest">
                 Космические Помехи
               </h2>
               <p className="text-purple-200 mb-6 font-serif italic break-words">
                 {errorMessage}
               </p>
               <div className="flex flex-col gap-3">
                 <button 
                   onClick={handleRetry}
                   className="px-8 py-3 rounded-lg font-mystic tracking-widest bg-amber-600 text-white hover:bg-amber-500 transition-all border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                 >
                   Попробовать снова
                 </button>
                 <button 
                   onClick={handleReset}
                   className="text-xs text-gray-500 hover:text-gray-300 transition-colors uppercase tracking-widest"
                 >
                   Начать сначала
                 </button>
               </div>
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