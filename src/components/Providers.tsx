'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// A stable module-level QueryClient instance for the SSR/loading phase.
// Each browser session gets its own via ThemedApp, but this ensures
// React Query context is available before ThemedApp hydrates.
let ssrQueryClient: QueryClient | null = null;
function getSSRQueryClient() {
  if (!ssrQueryClient) {
    ssrQueryClient = new QueryClient({
      defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
    });
  }
  return ssrQueryClient;
}

// ThemedApp contains OxygenUIThemeProvider which wraps MUI's CssBaseline.
// CssBaseline uses emotion's Global component, which renders a
// <style data-emotion="css-global"> element into the React tree during SSR.
// This causes a structural hydration mismatch (server: <style>, client: <div>)
// that is unfixable while rendering OxygenUIThemeProvider on the server.
//
// Solution: skip SSR for OxygenUIThemeProvider entirely. The page HTML still
// renders fully server-side (all children/content), just without the MUI
// theme wrapper. The globals.css pre-applies all critical baseline styles
// (background, text color, font-family, box-sizing) so there is zero
// visible flash between SSR and client hydration.
const ThemedApp = dynamic(() => import('./ThemedApp'), { ssr: false });

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  // During SSR and before ThemedApp loads on the client, wrap children in
  // QueryClientProvider using the SSR client so hooks still work.
  // ThemedApp will mount its own QueryClient immediately after JS loads.
  return (
    <QueryClientProvider client={getSSRQueryClient()}>
      <ThemedApp>{children}</ThemedApp>
    </QueryClientProvider>
  );
}
