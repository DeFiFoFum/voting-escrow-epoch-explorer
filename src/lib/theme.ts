export type Theme = "light" | "dark";

export interface ThemeConfig {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  border: string;
}

export const themes: Record<Theme, ThemeConfig> = {
  light: {
    background: "bg-gradient-to-br from-blue-50 to-white",
    foreground: "text-slate-900",
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md",
    secondary: "bg-white/95 backdrop-blur-md border border-slate-200/50",
    accent: "bg-gradient-to-r from-indigo-500 to-blue-500 text-white",
    muted: "text-slate-700",
    border: "border-slate-200/50",
  },
  dark: {
    background: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
    foreground: "text-white",
    primary: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md",
    secondary: "bg-white/10 backdrop-blur-md border border-white/20",
    accent: "bg-gradient-to-r from-blue-400 to-indigo-400 text-white",
    muted: "text-white/80",
    border: "border-white/20",
  },
};
