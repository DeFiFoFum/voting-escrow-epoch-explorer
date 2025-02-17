'use client';

import { ThemeProvider } from '@/lib/hooks/useTheme';
import { ThemeToggle } from '@/components/ThemeToggle';

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="relative">
        <ThemeToggle />
        {children}
      </div>
    </ThemeProvider>
  );
}
