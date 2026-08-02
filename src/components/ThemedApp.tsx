'use client';

import React from 'react';
import { OxygenUIThemeProvider } from '@wso2/oxygen-ui';
import AuthProvider from '@/components/auth/AuthProvider';

// This component is dynamically imported with ssr:false in Providers.tsx.
// It ONLY wraps with OxygenUIThemeProvider and AuthProvider — QueryClientProvider is in the
// parent Providers.tsx so it's available during SSR too.
export default function ThemedApp({ children }: { children: React.ReactNode }) {
  return (
    <OxygenUIThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </OxygenUIThemeProvider>
  );
}
