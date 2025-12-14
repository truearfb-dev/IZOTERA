import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { TRANSLATIONS } from '../constants';

interface Props {
  onSuccess: () => void;
  onGuestAccess: () => void;
}

export const AuthModal: React.FC<Props> = ({ onSuccess, onGuestAccess }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = TRANSLATIONS;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      }
      onSuccess();
    } catch (err: any) {
      console.error(err);
      let msg = err.message;
      
      // Translate technical errors to mystical/user-friendly Russian
      if (msg.includes('rate limit')) msg = 'Потоки энергии перегружены (Rate Limit). Попробуйте позже или войдите как Гость.';
      else if (msg.includes('Invalid login')) msg = 'Неверный шифр доступа (логин или пароль).';
      else if (msg.includes('already registered')) msg = 'Эта душа уже записана в книге судеб. Попробуйте войти.';
      else if (msg.includes('Password should be')) msg = 'Тайный ключ слишком прост (минимум 6 символов).';
      
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 animate-[fadeIn_0.5s_ease-out]">
      <div className="glass-panel rounded-3xl p-8 shadow-[0_0_40px_-5px_rgba(48,43,99,0.5)] border border-white/10">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2 animate-pulse">🗝️</div>
          <h2 className="text-2xl font-mystic text-amber-100 uppercase tracking-widest">{t.authTitle}</h2>
          <p className="text-purple-200 text-xs italic mt-2 opacity-80">{t.authDesc}</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <input
              type="email"
              required
              placeholder={t.emailLabel}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-amber-50 placeholder:text-purple-300/30 focus:border-amber-400/50 focus:outline-none transition-all"
            />
          </div>
          <div>
            <input
              type="password"
              required
              placeholder={t.passwordLabel}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-amber-50 placeholder:text-purple-300/30 focus:border-amber-400/50 focus:outline-none transition-all"
            />
          </div>

          {error && (
            <div className="text-red-300 text-xs bg-red-900/20 p-3 rounded border border-red-500/20 text-center leading-relaxed">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-mystic tracking-[0.2em] uppercase bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-[0_0_15px_rgba(88,28,135,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] border border-purple-500/30 transition-all transform active:scale-95 disabled:opacity-50"
          >
            {loading ? "Связь с космосом..." : (isLogin ? t.signIn : t.signUp)}
          </button>
        </form>
        
        <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
            <button
                type="button"
                onClick={onGuestAccess}
                className="w-full py-3 rounded-xl font-mystic tracking-[0.2em] uppercase bg-white/5 hover:bg-white/10 text-amber-100/70 hover:text-amber-100 border border-white/10 transition-all"
            >
                Продолжить как Гость
            </button>

            <div className="text-center">
            <button
                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                className="text-xs text-purple-300 hover:text-amber-200 transition-colors border-b border-transparent hover:border-amber-200 uppercase tracking-wide"
            >
                {isLogin ? t.authSwitchToRegister : t.authSwitchToLogin}
            </button>
            </div>
        </div>
      </div>
    </div>
  );
};