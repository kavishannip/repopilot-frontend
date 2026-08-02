'use client';

import React from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { Lock, Compass, ShieldCheck, Sparkles, LogIn } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { state, signIn } = useAuthContext();

  // Show loading skeleton while checking Asgardeo auth status
  if (state.isLoading) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-400">
          <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <span className="text-sm font-medium">Verifying authentication status...</span>
        </div>
      </AppShell>
    );
  }

  // If user is NOT authenticated, display Auth Protection Barrier
  if (!state.isAuthenticated) {
    return (
      <AppShell>
        <div className="mx-auto max-w-xl py-12 px-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center backdrop-blur-xl shadow-2xl space-y-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-inner">
              <Lock className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
                Authentication Required
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
                Sign in with your WSO2 Asgardeo account to analyze GitHub repositories, generate architecture diagrams, and chat with AI.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left py-2">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <Compass className="h-4 w-4 text-indigo-400 mb-1" />
                <p className="text-xs font-semibold text-slate-200">Deep Analysis</p>
                <p className="text-[11px] text-slate-400">AI repo structure brief</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <Sparkles className="h-4 w-4 text-indigo-400 mb-1" />
                <p className="text-xs font-semibold text-slate-200">Mermaid Diagrams</p>
                <p className="text-[11px] text-slate-400">Architecture visualization</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <ShieldCheck className="h-4 w-4 text-indigo-400 mb-1" />
                <p className="text-xs font-semibold text-slate-200">Private Sessions</p>
                <p className="text-[11px] text-slate-400">Scoped Asgardeo auth</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => signIn()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all duration-200 cursor-pointer active:scale-95"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In with Asgardeo</span>
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  // Authenticated: Render page children
  return <>{children}</>;
}
