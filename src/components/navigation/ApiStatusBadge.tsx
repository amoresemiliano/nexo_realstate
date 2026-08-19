import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, ShieldAlert, RefreshCw } from 'lucide-react';
import { checkBackendHealth, ApiStatus } from '../../services/apiClient';

/**
 * Determina de forma centralizada si el entorno actual es DEV o PROD.
 * DEV: /sistemas/nexo_realstate/dev/, localhost, o import.meta.env.DEV
 * PROD: /sistemas/nexo_realstate/ (sin /dev/)
 */
export const isDevEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  const pathname = window.location.pathname;
  const isMetaDev = Boolean((import.meta as any)?.env?.DEV);
  return (
    pathname.includes('/dev/') ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    isMetaDev
  );
};

export const ApiStatusBadge: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<ApiStatus | 'CHECKING'>('CHECKING');
  const [dbStatus, setDbStatus] = useState<string>('unknown');
  const [isChecking, setIsChecking] = useState<boolean>(false);

  // En producción el indicador técnico permanece oculto de la vista del cliente
  if (!isDevEnvironment()) {
    return null;
  }

  const runHealthCheck = async () => {
    setIsChecking(true);
    try {
      const result = await checkBackendHealth();
      setApiStatus(result.status);
      if (result.status === 'OK' && result.data) {
        setDbStatus(result.data.database || 'ok');
      } else {
        setDbStatus('unavailable');
      }
    } catch {
      setApiStatus('NETWORK_ERROR');
      setDbStatus('unavailable');
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  return (
    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs">
      <button
        onClick={runHealthCheck}
        disabled={isChecking}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium transition-all active:scale-95 cursor-pointer bg-slate-800/80 hover:bg-slate-700/80"
        title="Clic para re-verificar estado de API"
      >
        <RefreshCw className={`w-3 h-3 text-slate-400 ${isChecking ? 'animate-spin' : ''}`} />
        
        {apiStatus === 'CHECKING' && (
          <span className="text-slate-400">API: Verificando...</span>
        )}

        {apiStatus === 'OK' && (
          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
            <Wifi className="w-3 h-3" />
            <span>API Online {dbStatus === 'ok' ? '(DB OK)' : ''}</span>
          </span>
        )}

        {apiStatus === 'UNAUTHENTICATED' && (
          <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
            <ShieldAlert className="w-3 h-3" />
            <span>API Online (Sin Auth)</span>
          </span>
        )}

        {apiStatus === 'SERVER_ERROR' && (
          <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
            <ShieldAlert className="w-3 h-3" />
            <span>API Error 500</span>
          </span>
        )}

        {apiStatus === 'NETWORK_ERROR' && (
          <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
            <WifiOff className="w-3 h-3" />
            <span>API Offline (MVP Standalone)</span>
          </span>
        )}
      </button>
    </div>
  );
};
