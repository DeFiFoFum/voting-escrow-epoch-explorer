export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastConfig {
  duration?: number; // in milliseconds, default 1500
  type?: ToastType; // default 'info'
}

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
