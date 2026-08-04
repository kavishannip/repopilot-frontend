'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Paper,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Tooltip,
  CircularProgress,
  Divider,
} from '@wso2/oxygen-ui';
import {
  MessageSquare,
  Plus,
  Trash2,
  GitBranch,
  History,
  Clock,
  ExternalLink,
  ChevronRight,
  X,
  Layers,
} from 'lucide-react';
import { api } from '@/lib/api';
import { RepositoryItem, ChatSessionItem } from '@/lib/types';
import { useAppStore } from '@/stores/appStore';
import { getClientId } from '@/lib/clientId';
import ChatPanel from './ChatPanel';

export default function ChatWorkspace() {
  const queryClient = useQueryClient();
  const repoId = useAppStore((state) => state.repoId);
  const activeSessionId = useAppStore((state) => state.sessionId);
  const setSessionId = useAppStore((state) => state.setSessionId);
  const loadRepositoryDetails = useAppStore((state) => state.loadRepositoryDetails);

  const [selectedRepoId, setSelectedRepoId] = useState<string>(repoId || '');
  const [isSessionsDrawerOpen, setIsSessionsDrawerOpen] = useState<boolean>(false);

  // 1. Fetch user's scanned repositories for left side panel
  const { data: repos, isLoading: isReposLoading } = useQuery({
    queryKey: ['user-repositories'],
    queryFn: () => api.getRepositories(),
  });

  // Sync selectedRepoId with global repoId or first available repository
  useEffect(() => {
    if (repoId && !selectedRepoId) {
      setSelectedRepoId(repoId);
    } else if (repos && repos.length > 0 && !selectedRepoId) {
      setSelectedRepoId(repos[0].id);
    }
  }, [repoId, repos, selectedRepoId]);

  // Fetch details of selected repo to sync context
  const { data: selectedRepoDetails } = useQuery({
    queryKey: ['repository-details', selectedRepoId],
    queryFn: () => api.getRepository(selectedRepoId),
    enabled: Boolean(selectedRepoId),
  });

  useEffect(() => {
    if (selectedRepoDetails) {
      loadRepositoryDetails(selectedRepoDetails);
    }
  }, [selectedRepoDetails, loadRepositoryDetails]);

  // 2.  // Fetch chat sessions for selected repository
  const {
    data: sessions,
    isLoading: isSessionsLoading,
  } = useQuery({
    queryKey: ['chat-sessions', selectedRepoId],
    queryFn: () => api.listChatSessions(selectedRepoId),
    enabled: Boolean(selectedRepoId),
  });

  // Fetch history for active chat session to check if messages exist
  const { data: activeSessionHistory } = useQuery({
    queryKey: ['chat-history', activeSessionId],
    queryFn: () => api.getChatHistory(activeSessionId!),
    enabled: Boolean(activeSessionId),
  });

  const isCurrentSessionEmpty = activeSessionId && activeSessionHistory && activeSessionHistory.messages.length === 0;

  // Auto-select first session if available and none currently selected
  useEffect(() => {
    if (sessions && sessions.length > 0 && !activeSessionId) {
      setSessionId(sessions[0].id);
    }
  }, [sessions, activeSessionId, setSessionId]);

  // 3. Create New Chat Session Mutation
  const { mutate: createSession, isPending: isCreatingSession } = useMutation({
    mutationFn: () => api.createChatSession(selectedRepoId, getClientId()),
    onSuccess: (res) => {
      setSessionId(res.session_id);
      queryClient.invalidateQueries({ queryKey: ['chat-sessions', selectedRepoId] });
    },
  });

  // 4. Delete Chat Session Mutation
  const { mutate: deleteSession } = useMutation({
    mutationFn: (sessionId: string) => api.deleteChatSession(sessionId),
    onSuccess: (_, deletedSessionId) => {
      if (activeSessionId === deletedSessionId) {
        setSessionId(null);
      }
      queryClient.invalidateQueries({ queryKey: ['chat-sessions', selectedRepoId] });
    },
  });

  const activeRepo = repos?.find((r) => r.id === selectedRepoId);
  const sessionCount = sessions?.length || 0;

  return (
    <div className="flex h-[calc(100vh-120px)] w-full gap-4 overflow-hidden relative">
      {/* ------------------------------------------------------------- */}
      {/* LEFT PANEL: Repositories Selection List Only                  */}
      {/* ------------------------------------------------------------- */}
      <Paper className="w-64 shrink-0 h-full bg-slate-900/70 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-indigo-400" />
            <Typography variant="subtitle2" className="font-bold text-slate-200 text-sm">
              Repositories
            </Typography>
          </div>
          <Chip
            label={repos?.length ?? 0}
            size="small"
            className="bg-indigo-500/10 text-indigo-400 text-[10px] font-semibold h-5"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {isReposLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-2">
              <CircularProgress size={24} className="text-indigo-500" />
              <Typography variant="caption" className="text-slate-500 text-xs">
                Loading repositories...
              </Typography>
            </div>
          ) : !repos || repos.length === 0 ? (
            <div className="p-6 text-center space-y-2 mt-4">
              <GitBranch className="h-6 w-6 text-slate-600 mx-auto" />
              <Typography variant="body2" className="text-slate-400 text-xs font-medium">
                No scanned repositories
              </Typography>
              <Typography variant="caption" className="text-slate-500 text-[11px] block">
                Analyze a repository first to start chatting.
              </Typography>
            </div>
          ) : (
            repos.map((repo: RepositoryItem) => {
              const isSelected = selectedRepoId === repo.id;
              return (
                <div
                  key={repo.id}
                  onClick={() => {
                    setSelectedRepoId(repo.id);
                    setSessionId(null);
                  }}
                  className={`p-3 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500/40 text-indigo-300 shadow-sm'
                      : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Typography variant="subtitle2" className="font-semibold text-xs truncate">
                      {repo.owner}/{repo.name}
                    </Typography>
                    {isSelected && <span className="h-2 w-2 rounded-full bg-indigo-400 shrink-0" />}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{repo.language || 'Code'}</span>
                    {repo.has_deep_analysis ? (
                      <span className="text-emerald-400 font-medium">Deep Scan</span>
                    ) : (
                      <span className="text-amber-400 font-medium">Summary</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Paper>

      {/* ------------------------------------------------------------- */}
      {/* CENTER PANEL: Main Non-Collapsible Chat Workspace             */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 h-full flex flex-col min-w-0 bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Top Header of Chat Area */}
        <div className="p-3.5 px-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
          {/* Active Repo Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
              <GitBranch className="h-4 w-4" />
            </div>
            <div className="truncate">
              {activeRepo ? (
                <div className="flex items-center gap-2">
                  <Typography variant="subtitle2" className="font-bold text-slate-100 text-sm truncate">
                    {activeRepo.owner}/{activeRepo.name}
                  </Typography>
                  <a
                    href={activeRepo.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ) : (
                <Typography variant="subtitle2" className="font-semibold text-slate-400 text-sm">
                  Select a repository to chat
                </Typography>
              )}
            </div>
          </div>

          {/* Action Buttons: New Chat + Session Select Sidebar Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <Tooltip
              title={
                isCurrentSessionEmpty
                  ? 'Current chat session has no messages yet'
                  : 'Start a new chat session'
              }
            >
              <span>
                <Button
                  variant="contained"
                  size="small"
                  disabled={!selectedRepoId || isCreatingSession || Boolean(isCurrentSessionEmpty)}
                  startIcon={<Plus className="h-3.5 w-3.5" />}
                  onClick={() => createSession()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold normal-case shadow-sm disabled:opacity-50"
                >
                  New Chat
                </Button>
              </span>
            </Tooltip>


            <Tooltip title="Toggle Chat Sessions History">
              <Button
                variant={isSessionsDrawerOpen ? 'contained' : 'outlined'}
                size="small"
                disabled={!selectedRepoId}
                startIcon={<History className="h-3.5 w-3.5" />}
                onClick={() => setIsSessionsDrawerOpen(!isSessionsDrawerOpen)}
                className={`text-xs font-semibold normal-case ${
                  isSessionsDrawerOpen
                    ? 'bg-slate-800 text-indigo-300 border-slate-700'
                    : 'border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Sessions ({sessionCount})
              </Button>
            </Tooltip>
          </div>
        </div>

        {/* Non-Collapsible Main Chat Area Body */}
        <div className="flex-1 overflow-hidden p-4">
          {activeRepo ? (
            <ChatPanel />
          ) : (
            <Paper className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-950/40 border border-slate-800/80 rounded-2xl space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <MessageSquare className="h-7 w-7" />
              </div>
              <Typography variant="h6" className="font-bold text-slate-200">
                Select a Repository from Left Panel
              </Typography>
              <Typography variant="body2" className="text-slate-400 max-w-sm text-sm">
                Click any scanned repository on the left list to load its chat context and start asking questions.
              </Typography>
            </Paper>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* RIGHT SIDEBAR / DRAWER: Past Chat Sessions List               */}
      {/* ------------------------------------------------------------- */}
      {isSessionsDrawerOpen && (
        <Paper className="w-80 shrink-0 h-full bg-slate-950/90 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl transition-all animate-in slide-in-from-right duration-200 z-20">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-indigo-400" />
              <Typography variant="subtitle2" className="font-bold text-slate-200 text-sm">
                Chat History ({sessionCount})
              </Typography>
            </div>
            <IconButton
              size="small"
              onClick={() => setIsSessionsDrawerOpen(false)}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </IconButton>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {isSessionsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-2">
                <CircularProgress size={24} className="text-indigo-500" />
                <Typography variant="caption" className="text-slate-500 text-xs">
                  Loading sessions...
                </Typography>
              </div>
            ) : !sessions || sessions.length === 0 ? (
              <div className="p-6 text-center space-y-2 mt-4">
                <Clock className="h-6 w-6 text-slate-600 mx-auto" />
                <Typography variant="body2" className="text-slate-400 text-xs font-medium">
                  No previous sessions
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Plus className="h-3.5 w-3.5" />}
                  onClick={() => createSession()}
                  className="border-slate-800 text-slate-300 text-xs normal-case mt-2"
                >
                  Create New Chat
                </Button>
              </div>
            ) : (
              sessions.map((sess: ChatSessionItem) => {
                const isActive = activeSessionId === sess.id;
                const formattedDate = new Date(sess.updated_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={sess.id}
                    onClick={() => setSessionId(sess.id)}
                    className={`group relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                      isActive
                        ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300 font-semibold shadow-md'
                        : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <MessageSquare className={`h-4 w-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <Typography variant="body2" className="text-xs font-medium truncate leading-tight">
                            {sess.title}
                          </Typography>
                          {isActive && (
                            <Chip
                              label="Active"
                              size="small"
                              className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] h-4 font-semibold shrink-0"
                            />
                          )}
                        </div>
                        <Typography variant="caption" className="text-[10px] text-slate-500 block mt-0.5">
                          {formattedDate}
                        </Typography>
                      </div>
                    </div>


                    {/* Delete Icon */}
                    <Tooltip title="Delete Session">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(sess.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 p-1 transition-opacity"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </IconButton>
                    </Tooltip>
                  </div>
                );
              })
            )}
          </div>
        </Paper>
      )}
    </div>
  );
}
