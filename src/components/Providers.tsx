'use client';

import React, { useState, useEffect } from 'react';
import { OxygenUIThemeProvider } from '@wso2/oxygen-ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {mounted ? (
        <OxygenUIThemeProvider>{children}</OxygenUIThemeProvider>
      ) : (
        <>{children}</>
      )}
    </QueryClientProvider>
  );
}
