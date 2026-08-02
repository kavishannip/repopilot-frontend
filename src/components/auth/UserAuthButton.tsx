'use client';

import React from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { LogIn, LogOut } from 'lucide-react';

export default function UserAuthButton() {
  const { state, signIn, signOut } = useAuthContext();

  if (state.isLoading) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
        <span className="text-[11px]">Auth...</span>
      </div>
    );
  }

  if (state.isAuthenticated) {
    const displayName = state.username || state.email || 'User';
    const initial = displayName.charAt(0).toUpperCase();

    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-xs shadow-sm">
            {initial}
          </div>
          <span className="text-slate-200 text-xs font-medium max-w-[120px] truncate hidden sm:inline">
            {displayName}
          </span>
          <button
            type="button"
            onClick={() => signOut()}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signIn()}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-200 active:scale-95 cursor-pointer"
    >
      <LogIn className="h-3.5 w-3.5" />
      <span>Sign In</span>
    </button>
  );
}
