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
    const local = localStorage.getItem(`history_${session?.user?.id || 'guest'}`);
    if (local) setHistory(JSON.parse(local));
  };

  const saveToHistory = (pred: DailyPrediction) => {
    const newItem = { date: new Date().toISOString(), prediction: pred };
    const newHistory = [newItem, ...history];
    setHistory(newHistory);
    
    const key = session ? `history_${session.user.id}` : 'aetheria_history';
    localStorage.setItem(key, JSON.stringify(newHistory));
  };

  // Safety Timeout for Loading State
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (appState === AppState.Loading) {
      timeout = setTimeout(() => {
        setErrorMessage("Звезды сегодня задумчивы. Время ожидания истекло.");
        setAppState(AppState.Error);
      }, 60000);
    }
    return () => clearTimeout(timeout);
  }, [appState]);

  const fetchProfile = async () => {
    if (!session) return;
    
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
      
      if (error && error.code === 'PGRST116') {
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
        
      if (data) {
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
    const guestSession = {
      user: { id: GUEST_ID, email: 'guest@aetheria.void' },
      access_token: 'guest-token',
    };
    setSession(guestSession);
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

  useEffect(() => {
    if (appState === AppState.Loading && userData && session) {
      const fetchPrediction = async () => {
        try {
          playSound('reveal');
          const result = await generatePrediction(userData);
          setPrediction(result);
          saveToHistory(result);
          setAppState(AppState.Result);
          
          if (!isPremium && session.user.id !== GUEST_ID) {
            const newCount = usageCount + 1;
            setUsageCount(newCount);
            await supabase
              .from('profiles')
              .update({ free_usage_count: newCount })
              .eq('id', session.user.id);
          }
          
        } catch (error: any) {
          setErrorMessage(error.message || "Космическая связь была прервана.");
          setAppState(AppState.Error);
        }
      };
      
      fetchPrediction();
    } else if (appState === AppState.Loading && !userData) {
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
      if (!userData) {
          setUserData({ name: "Traveler", dob: "", tob: "", element: null, archetype: null, feeling: null }); 
      }
      setAppState(AppState.Result);
  };

  return (
    <div className="h-full w-full relative flex flex-col overflow-hidden">
      {/* Background Layers */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#0f0c29_90%)] z-0"></div>
      <div className="stars fixed inset-0 pointer-events-none z-0"></div>
      <div className="stars2 fixed inset-0 pointer-events-none z-0"></div>
      
      {/* Header - Compact */}
      <header className="relative z-10 p-3 md:p-5 flex justify-between items-center max-w-4xl mx-auto w-full shrink-0">
        <h1 
            onClick={() => { playSound('hover'); handleReset(); }}
            className="text-xl md:text-2xl font-mystic tracking-[0.2em] text-amber-500/80 uppercase drop-shadow-[0_0_10px_rgba(245,158,11,0.3)] cursor-pointer hover:text-amber-400 transition-colors"
        >
          Aetheria
        </h1>
        
        {session && (
          <div className="flex items-center gap-3">
             {appState !== AppState.History && (
                 <button 
                    onClick={handleOpenHistory}
                    className="text-xs text-amber-200/50 hover:text-amber-100 transition-colors uppercase tracking-widest flex items-center gap-1"
                 >
                    <span className="text-lg">📜</span>
                 </button>
             )}
          
             {!isPremium && session.user.id !== GUEST_ID && (
               <div className="text-[9px] md:text-[10px] text-purple-300/50 uppercase tracking-widest border border-purple-500/20 px-2 py-1 rounded-full">
                 {usageCount}/{MAX_FREE_PREDICTIONS} Free
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

      {/* Main Content Area - Scrollable internally if needed, but mostly fitted */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-2 w-full overflow-hidden">
        <div className="w-full h-full flex flex-col items-center justify-center max-w-lg mx-auto">
          {appState === AppState.SetupRequired && (
            <div className="glass-panel p-6 rounded-2xl max-w-md text-center border-amber-500/30">
              <h2 className="text-xl font-mystic text-amber-100 mb-2">Настройка</h2>
              <p className="text-purple-200 text-sm">Проверьте VITE_GEMINI_API_KEY</p>
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
            <div className="glass-panel rounded-2xl p-6 shadow-2xl text-center border-red-500/20 bg-red-900/10 w-full">
               <div className="text-3xl mb-2">🌑</div>
               <h2 className="text-lg font-mystic text-red-200 mb-2">Космические Помехи</h2>
               <p className="text-purple-200 text-sm mb-4">{errorMessage}</p>
               <div className="flex flex-col gap-2">
                 <button onClick={handleRetry} className="px-6 py-2 rounded-lg bg-amber-600 text-white text-sm">Еще раз</button>
                 <button onClick={handleReset} className="text-xs text-gray-500">Меню</button>
               </div>
            </div>
          )}
        </div>
      </main>
      
      <InstallPrompt />
      
      <footer className="relative z-10 py-2 text-center text-purple-900/30 text-[10px] font-serif shrink-0">
        &copy; {new Date().getFullYear()} Aetheria.
      </footer>
    </div>
  );
}