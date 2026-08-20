import React, { useState } from 'react';
import { Building2, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { login, AuthUser } from '../../services/authService';

interface LoginViewProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Por favor ingrese su email y contraseña.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await login({ email: email.trim(), password });

      if (res.status === 'OK' && res.data?.user) {
        onLoginSuccess(res.data.user);
      } else {
        setErrorMessage(
          res.error?.message || 'Credenciales de acceso inválidas. Verifique su email y contraseña.'
        );
      }
    } catch (err: any) {
      setErrorMessage('Ocurrió un error inesperado al conectar con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden select-none">
      {/* Dynamic Ambient Glow Backdrop */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Header */}
      <header className="p-6 relative z-10 flex items-center justify-between border-b border-slate-800/80 backdrop-blur-md bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center shadow-lg shadow-brand-600/30">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white">NEXO</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Plataforma Real Estate</p>
          </div>
        </div>

        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
          Versión DEV
        </span>
      </header>

      {/* Main Login Card Container */}
      <main className="p-4 relative z-10 flex-1 flex items-center justify-center max-w-md w-full mx-auto">
        <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-bold border border-brand-500/20 mb-3">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              <span>Autenticación Segura PHP PDO</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Iniciar Sesión</h2>
            <p className="text-xs text-slate-400 mt-1">Ingrese sus credenciales corporativas para acceder al CRM</p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-2xl text-xs font-bold flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block font-bold text-slate-300">Correo Electrónico *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="admin@vegendigital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-white placeholder-slate-600 font-semibold focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-300">Contraseña *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-white placeholder-slate-600 font-semibold focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-500 active:scale-95 text-white font-black text-xs rounded-2xl transition-all shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Ingresando al sistema...</span>
              ) : (
                <>
                  <span>Ingresar a Nexo</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Dev Hint Box */}
          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-[11px] text-slate-400 space-y-1">
            <span className="font-extrabold text-amber-400 uppercase tracking-wider block text-[10px]">Credenciales DEV</span>
            <p>Si creó un usuario mediante CLI:</p>
            <code className="text-slate-300 font-mono text-[10px] block bg-slate-900 p-1.5 rounded-lg border border-slate-800">
              php backend/tools/create_dev_admin.php
            </code>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-[11px] text-slate-600 border-t border-slate-900 relative z-10">
        Nexo Desarrollos &copy; 2026 • Vegen Digital Architecture
      </footer>
    </div>
  );
};
