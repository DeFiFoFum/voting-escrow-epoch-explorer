'use client';

import { useTheme } from '@/lib/hooks/useTheme';
import { ToastType } from '@/lib/types/toast';

interface ToastProps {
  message: string;
  type: ToastType;
}

export function Toast({ message, type }: ToastProps) {
  const { theme } = useTheme();

  const styles = {
    success: 'bg-green-500/90',
    error: 'bg-red-500/90',
    info: 'bg-blue-500/90',
    warning: 'bg-yellow-500/90',
  };

  return (
    <div
      className={`
        fixed top-4 right-4 z-[9999]
        px-4 py-2 rounded-lg
        text-white backdrop-blur-md
        animate-toast-slide
        ${styles[type]}
        ${theme === 'dark' ? 'shadow-lg border border-white/10' : 'shadow-xl'}
      `}
    >
      {message}
    </div>
  );
}

export function Toasts({ toasts }: { toasts: { id: string; message: string; type: ToastType }[] }) {
  return (
    <>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            top: `${(index + 1) * 4}rem`,
          }}
          className="fixed right-4 z-[9999]"
        >
          <Toast message={toast.message} type={toast.type} />
        </div>
      ))}
    </>
  );
}
