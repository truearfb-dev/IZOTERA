import React, { useEffect, useState } from 'react';

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setShowButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowButton(false);
  };

  if (!showButton) return null;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 animate-[slideUp_0.5s_ease-out]">
      <button
        onClick={handleInstallClick}
        className="glass-panel bg-amber-900/40 border-amber-500/30 text-amber-100 px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-105 transition-transform backdrop-blur-xl"
      >
        <span className="text-xl">✨</span>
        <div className="text-left">
          <span className="block text-xs uppercase tracking-widest text-amber-200/70">Приложение</span>
          <span className="font-mystic text-sm">Установить Aetheria</span>
        </div>
      </button>
    </div>
  );
};