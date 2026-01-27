
import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldAlert } from 'lucide-react';

interface AuthGateProps {
  onAuthenticated: () => void;
}

const AuthGate: React.FC<AuthGateProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // 環境変数からパスワードを取得（型エラー回避のため as any を使用）
  const CORRECT_PASSWORD = (process as any).env.VITE_AUTH_PASSWORD || 'fren-access'; 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsExiting(true);
      setTimeout(() => {
        localStorage.setItem('fren_auth_status', 'true');
        onAuthenticated();
      }, 600);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-700 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`max-w-md w-full px-8 text-center transition-transform duration-700 ${isExiting ? 'scale-95 translate-y-4' : 'scale-100 translate-y-0'} ${error ? 'animate-shake' : ''}`}>
        
        <div className="mb-12 inline-block">
          <div className="mb-4">
            <span className="text-white font-black text-[36px] tracking-tighter">fren</span>
          </div>
          <p className="text-white text-[10px] font-bold uppercase tracking-[0.4em] mt-2 opacity-80">Contract document Generator</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative group">
            <label className="block text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-left opacity-60">
              password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="w-full bg-transparent border-b border-slate-800 py-3 text-white text-xl font-light tracking-widest outline-none focus:border-white transition-colors placeholder:text-slate-900"
                placeholder="••••••••"
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-white hover:text-slate-300 transition-colors"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
          
          {error && (
            <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest animate-pulse flex items-center justify-center gap-2">
              <ShieldAlert size={12} /> Access Denied
            </p>
          )}
        </form>

        <div className="mt-24 text-white text-[9px] uppercase tracking-widest font-medium opacity-40">
          &copy; 2026 fren Inc.
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};

export default AuthGate;
