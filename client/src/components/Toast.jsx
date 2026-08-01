import React, { createContext, useCallback, useContext, useState, useMemo } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const variantConfig = {
  success: {
    accent: 'bg-success-500',
    bg: 'bg-white',
    Icon: CheckCircle2,
    iconClass: 'text-success-600',
    titleClass: 'text-neutral-900',
  },
  error: {
    accent: 'bg-danger-500',
    bg: 'bg-white',
    Icon: AlertCircle,
    iconClass: 'text-danger-600',
    titleClass: 'text-neutral-900',
  },
  info: {
    accent: 'bg-primary-500',
    bg: 'bg-white',
    Icon: Info,
    iconClass: 'text-primary-600',
    titleClass: 'text-neutral-900',
  },
};

function ToastViewport({ toasts, onDismiss }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:right-4 sm:left-auto sm:top-4 sm:w-[380px]"
    >
      {toasts.map(t => {
        const cfg = variantConfig[t.variant] || variantConfig.info;
        const { Icon } = cfg;
        return (
          <div
            key={t.id}
            role="status"
            className={`${t.leaving ? 'toast-leave' : 'toast-enter'} pointer-events-auto w-full max-w-sm ${cfg.bg} border border-neutral-200 rounded-lg shadow-[0_10px_25px_-10px_rgb(0,0,0,0.2)] overflow-hidden`}
          >
            <div className="flex items-start gap-3 p-3">
              <div className={`flex h-5 w-5 shrink-0 items-center justify-center ${cfg.iconClass}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium leading-5 ${cfg.titleClass}`}>{t.title}</p>
                {t.description ? (
                  <p className="mt-0.5 text-sm text-neutral-500 leading-5">{t.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => onDismiss(t.id)}
                className="shrink-0 rounded-md p-0.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className={`h-0.5 w-full ${cfg.accent}`} style={{ transformOrigin: 'left', animation: `shrink ${t.duration}ms linear forwards` }}>
              <style>{`@keyframes shrink{from{transform:scaleX(1)}to{transform:scaleX(0)}}`}</style>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.find(t => t.id === id)?.leaving
      ? prev.filter(t => t.id !== id)
      : prev.map(t => t.id === id ? { ...t, leaving: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 160);
  }, []);

  const show = useCallback(({ variant = 'info', title, description, duration = 4000 }) => {
    const id = Math.random().toString(36).slice(2);
    const toast = { id, variant, title, description, duration };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  const value = useMemo(() => ({
    success: (title, description) => show({ variant: 'success', title, description }),
    error:   (title, description) => show({ variant: 'error',   title, description }),
    info:    (title, description) => show({ variant: 'info',    title, description }),
    dismiss,
  }), [show, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
