"use client";

import "./globals.css";
import { ThemeProvider } from "@/lib/hooks/useTheme";
import { Toasts } from "@/components/ui/toast";
import { ToastProvider, useToast } from "@/lib/hooks/ToastContext";

function ToastContainer() {
  const { toasts } = useToast();
  return <Toasts toasts={toasts} />;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ToastProvider>
            {children}
            <ToastContainer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
