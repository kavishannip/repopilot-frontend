import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'RepoPilot — GitHub Repository Analyzer',
  description: 'AI-powered single-page repository analyzer with deep structural analysis and conversational chat.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body suppressHydrationWarning className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <Providers>{children}</Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
