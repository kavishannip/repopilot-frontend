'use client';

import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Alert,
  IconButton,
  Tooltip,
  Typography,
  CircularProgress,
} from '@wso2/oxygen-ui';
import { Search, Clipboard, Sparkles, ArrowRight } from 'lucide-react';
import { useQuickSummary } from '@/hooks/useQuickSummary';
import { useAppStore } from '@/stores/appStore';

const GITHUB_URL_REGEX = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(?:\/)?$/;

const EXAMPLE_REPOS = [
  { label: 'facebook/react', url: 'https://github.com/facebook/react' },
  { label: 'vercel/next.js', url: 'https://github.com/vercel/next.js' },
  { label: 'tailwindlabs/tailwindcss', url: 'https://github.com/tailwindlabs/tailwindcss' },
];

export default function RepoUrlInput() {
  const [inputUrl, setInputUrl] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const { mutate: fetchSummary, isPending, error, reset: resetMutation } = useQuickSummary();
  const repoUrl = useAppStore((state) => state.repoUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    resetMutation();

    const cleanUrl = inputUrl.trim();
    if (!cleanUrl) {
      setValidationError('Please enter a GitHub repository URL');
      return;
    }

    if (!GITHUB_URL_REGEX.test(cleanUrl)) {
      setValidationError('Please enter a valid public GitHub repository URL (e.g. https://github.com/owner/repo)');
      return;
    }

    fetchSummary(cleanUrl);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputUrl(text.trim());
        setValidationError(null);
      }
    } catch {
      // Clipboard permission denied or unavailable
    }
  };

  const handleExampleClick = (url: string) => {
    setInputUrl(url);
    setValidationError(null);
    resetMutation();
    fetchSummary(url);
  };

  return (
    <Paper
      elevation={0}
      className="border border-slate-800 bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl shadow-indigo-950/20"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Search className="h-5 w-5" />
        </div>
        <div>
          <Typography variant="h5" className="font-bold text-slate-100 text-lg md:text-xl tracking-tight">
            Analyze a GitHub Repository
          </Typography>
          <Typography variant="body2" className="text-slate-400 text-xs md:text-sm">
            Enter any public GitHub repository URL to generate instant architecture intelligence.
          </Typography>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <TextField
              fullWidth
              placeholder="https://github.com/owner/repository"
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
                if (validationError) setValidationError(null);
              }}
              disabled={isPending}
              variant="outlined"
              size="medium"
              slotProps={{
                input: {
                  endAdornment: (
                    <Tooltip title="Paste from clipboard">
                      <IconButton
                        size="small"
                        onClick={handlePaste}
                        disabled={isPending}
                        className="text-slate-400 hover:text-slate-200"
                      >
                        <Clipboard className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '0.95rem',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  '& fieldset': {
                    borderColor: 'rgba(51, 65, 85, 0.8)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(99, 102, 241, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1',
                  },
                },
              }}
            />
          </div>

          <Button
            type="submit"
            variant="contained"
            disabled={isPending}
            className="h-12 px-6 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 shrink-0"
          >
            {isPending ? (
              <>
                <CircularProgress size={20} className="text-white" />
                <span>Inspecting Repo...</span>
              </>
            ) : (
              <>
                <span>Analyze</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Error Alert Display */}
        {(validationError || error) && (
          <Alert severity="error" className="bg-rose-950/40 border border-rose-800/60 text-rose-300 rounded-xl">
            {validationError || error?.message || 'Failed to analyze repository URL. Please check the URL and try again.'}
          </Alert>
        )}

        {/* Example Quick Click Chips */}
        <div className="flex items-center gap-2 pt-2 text-xs text-slate-400 flex-wrap">
          <span className="flex items-center gap-1 font-medium text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Examples:
          </span>
          {EXAMPLE_REPOS.map((example) => (
            <button
              key={example.label}
              type="button"
              onClick={() => handleExampleClick(example.url)}
              disabled={isPending}
              className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-indigo-300 font-mono text-xs border border-slate-700/50 transition-colors"
            >
              {example.label}
            </button>
          ))}
        </div>
      </form>
    </Paper>
  );
}
