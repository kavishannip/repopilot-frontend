'use client';

import React, { useState, useRef, useEffect } from 'react';
import SectionCard from '../shared/SectionCard';
import TagChip from '../shared/TagChip';
import ChatMessageItem from './ChatMessageItem';
import SuggestedQuestions from './SuggestedQuestions';
import { useChatSession } from '@/hooks/useChatSession';
import { useSendMessage } from '@/hooks/useSendMessage';
import { TextField, IconButton, CircularProgress, LinearProgress } from '@wso2/oxygen-ui';
import { MessageSquare, Send, Sparkles, Loader2, Bot } from 'lucide-react';

export default function ChatPanel() {
  const [inputText, setInputText] = useState('');
  const [extendedSearchNotice, setExtendedSearchNotice] = useState(false);

  const {
    sessionId,
    createSession,
    isCreatingSession,
    history,
    isLoadingHistory,
    isChatUnlocked,
  } = useChatSession();

  const { mutate: sendMessage, isPending: isSending } = useSendMessage();

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-create chat session if unlocked and session ID not present
  useEffect(() => {
    if (isChatUnlocked && !sessionId && !isCreatingSession) {
      createSession();
    }
  }, [isChatUnlocked, sessionId, isCreatingSession, createSession]);

  // Handle 3s extended search indicator during long response latency
  useEffect(() => {
    if (isSending) {
      setExtendedSearchNotice(false);
      timerRef.current = setTimeout(() => {
        setExtendedSearchNotice(true);
      }, 3000);
    } else {
      setExtendedSearchNotice(false);
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isSending]);

  // Auto-scroll to bottom on message list change or sending state
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history, isSending]);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed || isSending || !sessionId) return;
    setInputText('');
    sendMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isChatUnlocked) return null;

  return (
    <SectionCard
      title="Chat with Repository"
      subtitle="AI-powered structural QA and code reasoning."
      icon={<MessageSquare className="h-5 w-5 text-indigo-400" />}
      badge={<TagChip label="Unlocked" category="frontend" />}
      collapsible
    >
      <div className="space-y-4">
        {/* Messages Container — 450px Scrollable */}
        <div
          ref={chatContainerRef}
          className="h-[450px] overflow-y-auto p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 scrollbar-thin scrollbar-thumb-slate-800"
        >
          {isLoadingHistory || isCreatingSession ? (
            <div className="flex flex-col items-center justify-center h-full space-y-3">
              <CircularProgress size={32} className="text-indigo-500" />
              <span className="text-xs text-slate-400 font-medium">Initializing AI chat session...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col justify-between h-full py-4">
              <div className="flex flex-col items-center text-center justify-center flex-1 space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Bot className="h-6 w-6" />
                </div>
                <span className="font-semibold text-slate-200 text-sm">Ask anything about this codebase</span>
                <span className="text-xs text-slate-400 max-w-sm">
                  Powered by vector search and structural dependency graph context.
                </span>
              </div>
              <SuggestedQuestions onSelectQuestion={(q) => sendMessage(q)} />
            </div>
          ) : (
            <>
              {history.map((msg) => (
                <ChatMessageItem key={msg.id} message={msg} />
              ))}

              {/* Thinking Indicator position */}
              {isSending && (
                <div className="flex justify-start gap-3 items-start animate-in fade-in duration-300">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/20">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="space-y-2 max-w-[80%]">
                    <div className="rounded-2xl rounded-tl-sm bg-slate-900/90 border border-slate-800 p-4 text-xs text-indigo-300 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 animate-pulse text-indigo-400 shrink-0" />
                      <span className="font-medium">Thinking... analyzing code chunks</span>
                    </div>

                    {/* >3s Extended Search Progress Bar */}
                    {extendedSearchNotice && (
                      <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 space-y-1.5 animate-in fade-in duration-300">
                        <span className="text-[11px] font-medium text-cyan-300 block">
                          Searching additional files for deeper context...
                        </span>
                        <LinearProgress className="h-1 bg-cyan-950 rounded-full text-cyan-400" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sticky Chat Input Bar */}
        <div className="flex items-end gap-2 p-2 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex-1">
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Ask a question about this repository... (Enter to send, Shift+Enter for new line)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending || !sessionId}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'transparent',
                  color: '#f8fafc',
                  fontSize: '0.875rem',
                  '& fieldset': { border: 'none' },
                },
              }}
            />
          </div>

          <IconButton
            onClick={handleSend}
            disabled={isSending || !inputText.trim() || !sessionId}
            className="h-10 w-10 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white disabled:text-slate-500 rounded-xl transition-all shrink-0"
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </IconButton>
        </div>
      </div>
    </SectionCard>
  );
}
