'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Tooltip, IconButton } from '@wso2/oxygen-ui';
import { Compass, Activity, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '@/lib/constants';
import { useAppStore } from '@/stores/appStore';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export default function Navbar() {
  const [isClient, setIsClient] = React.useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const reset = useAppStore((state) => state.reset);
  const currentStep = useAppStore((state) => state.currentStep);

  useEffect(() => {
    setIsClient(true);
    let isMounted = true;
    async function checkHealth() {
      try {
        const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' }).catch(() => null);
        if (isMounted) setBackendOnline(res ? res.ok || res.status < 500 : false);
      } catch {
        if (isMounted) setBackendOnline(false);
      }
    }
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
        {/* Logo & Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => currentStep !== 'input' && reset()}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Typography variant="h6" className="font-bold text-slate-100 text-base md:text-lg tracking-tight">
                RepoPilot
              </Typography>
              <Chip
                label="v1.0"
                size="small"
                className="h-4 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-semibold"
              />
            </div>
            <Typography variant="caption" className="text-slate-400 text-[11px] block -mt-1 hidden sm:block">
              Public GitHub Repo Analyzer
            </Typography>
          </div>
        </div>

        {/* Action Controls & Indicators */}
        <div className="flex items-center gap-3">
          {/* Backend Status Dot — only render after client mount to prevent hydration mismatch */}
          {isClient && (
            <Tooltip
              title={
                backendOnline === true
                  ? 'Backend API Connected (localhost:5000)'
                  : backendOnline === false
                  ? 'Backend API Disconnected'
                  : 'Checking API Status...'
              }
            >
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
                <Activity className="h-3.5 w-3.5 text-slate-400" />
                <span
                  className={`h-2 w-2 rounded-full ${
                    backendOnline === true
                      ? 'bg-emerald-400 animate-pulse'
                      : backendOnline === false
                      ? 'bg-rose-500'
                      : 'bg-amber-400'
                  }`}
                />
                <span className="text-slate-400 text-[11px] hidden md:inline">
                  {backendOnline === true ? 'API Ready' : backendOnline === false ? 'API Offline' : 'Connecting'}
                </span>
              </div>
            </Tooltip>
          )}

          {/* Reset App State */}
          {currentStep !== 'input' && (
            <Tooltip title="Start New Repo Analysis">
              <IconButton
                size="small"
                onClick={reset}
                className="text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
              >
                <RefreshCw className="h-4 w-4" />
              </IconButton>
            </Tooltip>
          )}

          {/* GitHub Source Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            aria-label="GitHub Repository"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
