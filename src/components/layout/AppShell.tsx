'use client';

import React from 'react';
import Navbar from './Navbar';
import { Typography } from '@wso2/oxygen-ui';
import { Compass } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Decorative Gradients & Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-cyan-500/10 blur-[100px] rounded-full" />
        <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute top-2/3 -right-40 w-[400px] h-[400px] bg-indigo-600/5 blur-[120px] rounded-full" />
      </div>

      {/* Top Navbar */}
      <Navbar />

      {/* Main Single-Column App Body (Max 900px / max-w-4xl) */}
      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-indigo-400" />
            <span className="font-medium text-slate-400">RepoPilot</span> — Single-Page Repository Intelligence
          </div>
          <div>Powered by WSO2 Oxygen UI & Next.js 15</div>
        </div>
      </footer>
    </div>
  );
}
