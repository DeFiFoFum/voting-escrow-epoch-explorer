"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Toast, ToastConfig, ToastType } from "../types/toast";

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, config?: ToastConfig) => void;
  success: (message: string, config?: ToastConfig) => void;
  error: (message: string, config?: ToastConfig) => void;
  info: (message: string, config?: ToastConfig) => void;
  warning: (message: string, config?: ToastConfig) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, config: ToastConfig = {}) => {
    const { duration = 1500, type = "info" } = config;
    const id = Date.now().toString();

    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const success = useCallback(
    (message: string, config?: ToastConfig) =>
      showToast(message, { ...config, type: "success" }),
    [showToast]
  );

  const error = useCallback(
    (message: string, config?: ToastConfig) =>
      showToast(message, { ...config, type: "error" }),
    [showToast]
  );

  const info = useCallback(
    (message: string, config?: ToastConfig) =>
      showToast(message, { ...config, type: "info" }),
    [showToast]
  );

  const warning = useCallback(
    (message: string, config?: ToastConfig) =>
      showToast(message, { ...config, type: "warning" }),
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{ toasts, showToast, success, error, info, warning }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
