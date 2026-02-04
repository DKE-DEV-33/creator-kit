'use client';

/**
 * ToastProvider
 *
 * Lightweight, global toast system for the CreatorKit UI.
 */
import { createContext, useContext, useMemo, useState } from 'react';

export type ToastTone = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  tone: ToastTone;
}

export interface ToastContextValue {
  pushToast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const value = useMemo<ToastContextValue>(
    () => ({
      pushToast(message, tone = 'info') {
        const id = crypto.randomUUID();
        setToasts((current) => [...current, { id, message, tone }]);
        window.setTimeout(() => {
          setToasts((current) => current.filter((toast) => toast.id !== id));
        }, 2600);
      },
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-6 top-6 z-50 flex w-[280px] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-xl px-3 py-2 text-xs font-semibold shadow-lg backdrop-blur ${
              toast.tone === 'success'
                ? 'bg-emerald-100 text-emerald-800'
                : toast.tone === 'error'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
