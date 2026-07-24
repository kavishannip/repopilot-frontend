'use client';

import React from 'react';
import { OxygenUIThemeProvider } from '@wso2/oxygen-ui';

// This component is dynamically imported with ssr:false in Providers.tsx.
// It ONLY wraps with OxygenUIThemeProvider — QueryClientProvider is in the
// parent Providers.tsx so it's available during SSR too.
export default function ThemedApp({ children }: { children: React.ReactNode }) {
  return <OxygenUIThemeProvider>{children}</OxygenUIThemeProvider>;
}
