'use client';

import React from 'react';
import { AuthProvider as AsgardeoAuthProvider } from '@asgardeo/auth-react';

const authConfig = {
  clientID: process.env.NEXT_PUBLIC_ASGARDEO_CLIENT_ID || '',
  baseUrl: process.env.NEXT_PUBLIC_ASGARDEO_BASE_URL || '',
  signInRedirectURL: process.env.NEXT_PUBLIC_ASGARDEO_REDIRECT_URL || 'http://localhost:3000',
  signOutRedirectURL: process.env.NEXT_PUBLIC_ASGARDEO_REDIRECT_URL || 'http://localhost:3000',
  scope: ['openid', 'profile', 'email']
};

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AsgardeoAuthProvider config={authConfig}>
      {children}
    </AsgardeoAuthProvider>
  );
}
