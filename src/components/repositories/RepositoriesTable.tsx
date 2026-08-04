'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Typography,
  CircularProgress,
  Box,
} from '@wso2/oxygen-ui';
import { Database, GitBranch, Star, ArrowRight, RefreshCw, Layers, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { RepositoryItem } from '@/lib/types';

export default function RepositoriesTable() {
  const router = useRouter();

  const handleSelectRepo = (repoId: string) => {
    router.push(`/repositories/${repoId}`);
  };

  const {
    data: repos,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['user-repositories'],
    queryFn: () => api.getRepositories(),
  });

  if (isLoading) {

    return (
      <Box className="flex flex-col items-center justify-center py-20 space-y-4">
        <CircularProgress size={36} className="text-indigo-500" />
        <Typography variant="body2" className="text-slate-400">
          Loading your scanned repositories...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Paper className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
        <Typography variant="h6" className="text-rose-400 font-semibold">
          Failed to load repositories
        </Typography>
        <Typography variant="body2" className="text-slate-400 max-w-md mx-auto">
          {error instanceof Error ? error.message : 'An error occurred while fetching your repository list.'}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshCw className="h-4 w-4" />}
          onClick={() => refetch()}
        >
          Try Again
        </Button>
      </Paper>
    );
  }

  if (!repos || repos.length === 0) {
    return (
      <Paper className="p-12 text-center flex flex-col items-center justify-center bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Database className="h-7 w-7" />
        </div>
        <Typography variant="h6" align="center" className="font-bold text-slate-200 text-center">
          No Scanned Repositories Yet
        </Typography>
        <Typography variant="body2" align="center" className="text-slate-400 max-w-md mx-auto text-sm text-center">
          Repositories you analyze will appear here in your central catalog for fast access and deep conversational chat.
        </Typography>
      </Paper>

    );
  }

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h5" className="font-extrabold text-slate-100 tracking-tight">
            Scanned Repositories
          </Typography>
          <Typography variant="body2" className="text-slate-400 text-xs mt-0.5">
            Your personal catalog of analyzed GitHub projects ({repos.length})
          </Typography>
        </div>
        <Button
          variant="text"
          size="small"
          startIcon={<RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? 'animate-spin' : ''}`} />}
          onClick={() => refetch()}
          className="text-slate-400 hover:text-slate-200"
        >
          Refresh
        </Button>
      </div>

      {/* Repositories Table using WSO2 Oxygen UI Table components */}
      <TableContainer component={Paper} className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <Table aria-label="user scanned repositories table">
          <TableHead className="bg-slate-950/80">
            <TableRow>
              <TableCell className="text-slate-400 font-semibold text-xs py-3.5">Repository</TableCell>
              <TableCell className="text-slate-400 font-semibold text-xs py-3.5">Language</TableCell>
              <TableCell className="text-slate-400 font-semibold text-xs py-3.5">Stars</TableCell>
              <TableCell className="text-slate-400 font-semibold text-xs py-3.5">Analysis Status</TableCell>
              <TableCell className="text-slate-400 font-semibold text-xs py-3.5 text-right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {repos.map((repo: RepositoryItem) => (
              <TableRow
                key={repo.id}
                hover
                onClick={() => handleSelectRepo(repo.id)}
                className="cursor-pointer hover:bg-slate-800/40 transition-colors border-b border-slate-800/60"
              >
                {/* Repository Name & Owner */}
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                      <GitBranch className="h-4 w-4" />
                    </div>
                    <div>
                      <Typography variant="subtitle2" className="font-semibold text-slate-100 text-sm">
                        {repo.owner}/{repo.name}
                      </Typography>
                      <Typography variant="caption" className="text-slate-500 text-xs block truncate max-w-xs">
                        {repo.repo_url}
                      </Typography>
                    </div>
                  </div>
                </TableCell>

                {/* Language */}
                <TableCell className="py-4">
                  {repo.language ? (
                    <Chip
                      label={repo.language}
                      size="small"
                      className="bg-slate-800 text-slate-300 text-xs border border-slate-700/60"
                    />
                  ) : (
                    <span className="text-slate-600 text-xs">—</span>
                  )}
                </TableCell>

                {/* Stars */}
                <TableCell className="py-4">
                  <div className="flex items-center gap-1 text-slate-300 text-xs">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400/20" />
                    <span>{repo.stars?.toLocaleString() ?? 0}</span>
                  </div>
                </TableCell>

                {/* Analysis Status */}
                <TableCell className="py-4">
                  {repo.has_deep_analysis ? (
                    <Chip
                      icon={<Sparkles className="h-3 w-3 text-emerald-400" />}
                      label="Deep Scan Complete"
                      size="small"
                      className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium"
                    />
                  ) : repo.has_quick_summary ? (
                    <Chip
                      icon={<Layers className="h-3 w-3 text-amber-400" />}
                      label="Quick Summary Only"
                      size="small"
                      className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-medium"
                    />
                  ) : (
                    <Chip
                      label="Pending"
                      size="small"
                      className="bg-slate-800 text-slate-400 text-[11px]"
                    />
                  )}
                </TableCell>

                {/* Action */}
                <TableCell className="py-4 text-right">
                  <Button
                    variant="contained"
                    size="small"
                    endIcon={<ArrowRight className="h-3.5 w-3.5" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectRepo(repo.id);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold normal-case shadow-sm"
                  >
                    View Analysis
                  </Button>
                </TableCell>
              </TableRow>

            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
