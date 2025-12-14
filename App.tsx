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
  Onboarding,
  Auth,    // User must sign in/up to proceed
  Paywall, // User reached limits
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

  // Initialize Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Profile when Session Changes
  useEffect(() => {
    if (session) {
      fetchProfile();
    } else {
      setUsageCount(0);
      setIsPremium(false);
    }
  }, [session]);

  const fetchProfile = async () => {
    if (!session) return;
    setIsLoadingProfile(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('free_usage_count, is_premium')
        .eq('id', session.user.id)
        .single();
        
      if (error) {
        // If profile doesn't exist yet (race condition with trigger), retry or default
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
    
    // Logic Flow:
    // 1. If not logged in -> Go to Auth
    // 2. If logged in -> Check limits
    if (!session) {
      setAppState(AppState.Auth);
    } else {
      checkLimitsAndProceed();
    }
  };

  const checkLimitsAndProceed = () => {
    if (isLoadingProfile) return; // Wait for profile
    
    // Recalculate based on fresh state
    if (!isPremium && usageCount >= MAX_FREE_PREDICTIONS) {
      setAppState(AppState.Paywall);
    } else {
      setAppState(AppState.Loading);
    }
  };

  // Called when Auth is successful
  const handleAuthSuccess = async () => {
    // Wait a brief moment for the session to propagate and profile to fetch
    await fetchProfile();
    // After auth, if we have userData waiting, check limits
    if (userData) {
      checkLimitsAndProceed();
    } else {
      setAppState(AppState.Onboarding);
    }
  };

  const handleUnlockPremium = async () => {
    // In a real app, this is triggered via Webhook from backend.
    // For demo/MVP, we can optimistically update if we trust the client (we shouldn't)
    // OR we trigger a call to our Edge Function.
    // For now, we will simulate the update on the client for immediate feedback, 
    // assuming the Edge Function flow you set up handles the actual DB update.
    
    // NOTE: This assumes you've implemented the payment flow.
    // Since we are mocking the payment UI in Paywall.tsx, let's mock the result here too.
    
    setIsPremium(true); 
    // If they were trying to get a result, proceed to loading
    if (userData) {
      setAppState(AppState.Loading);
    } else {
      setAppState(AppState.Onboarding);
    }
  };

  // Effect to trigger generation
  useEffect(() => {
    // Only generate if we are in Loading state, have user data, have session, and permissions are clear
    if (appState === AppState.Loading && userData && session) {
      const fetchPrediction = async () => {
        try {
          const result = await generatePrediction(userData);
          setPrediction(result);
          setAppState(AppState.Result);
          
          // Increment usage in DB
          if (!isPremium) {
            const newCount = usageCount + 1;
            setUsageCount(newCount);
            
            // Fire and forget update
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
      {/* Persistent "Stars" background is in index.html, adding a vignette here */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#0f0c29_90%)] z-0"></div>

      <header className="relative z-10 p-6 flex justify-between items-center max-w-4xl mx-auto w-full">
        <h1 className="text-2xl md:text-3xl font-mystic tracking-[0.3em] text-amber-500/80 uppercase drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
          Aetheria
        </h1>
        
        {/* User Status / Logout */}
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
      
      {/* Install Prompt Button */}
      <InstallPrompt />
      
      <footer className="relative z-10 p-4 text-center text-purple-900/40 text-xs font-serif">
        &copy; {new Date().getFullYear()} Cosmic Alignments. Deterministic Logic Engine.
      </footer>
    </div>
  );
}