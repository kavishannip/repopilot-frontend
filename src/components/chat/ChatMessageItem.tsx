'use client';

import React, { useState } from 'react';
import Markdown from '../shared/Markdown';
import { ChatMessage } from '@/lib/types';
import { Chip, IconButton, Tooltip } from '@wso2/oxygen-ui';
import { User, Compass, Copy, Check, FileText, Search, Sparkles } from 'lucide-react';

interface ChatMessageItemProps {
  message: ChatMessage;
}

export default function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-sm bg-indigo-600/90 text-white px-4 py-3 shadow-md shadow-indigo-950/40 text-xs md:text-sm font-sans leading-relaxed">
          {message.content}
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          <User className="h-4 w-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-3 items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/20 mt-1">
        <Compass className="h-4 w-4" />
      </div>

      <div className="max-w-[90%] sm:max-w-[85%] space-y-3">
        {/* Assistant Content Card */}
        <div className="rounded-2xl rounded-tl-sm bg-slate-900/90 border border-slate-800 p-4 md:p-5 shadow-lg shadow-black/20 text-xs md:text-sm relative group">
          <Markdown content={message.content} />

          {/* Copy Button */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Tooltip title={copied ? 'Copied!' : 'Copy response'}>
              <IconButton
                size="small"
                onClick={handleCopy}
                className="text-slate-400 hover:text-slate-200 bg-slate-950/60 hover:bg-slate-950 border border-slate-800"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </IconButton>
            </Tooltip>
          </div>
        </div>

        {/* Assistant Response Metadata Badge Row */}
        {(typeof message.sufficient === 'boolean' ||
          typeof message.retrieved_chunks_count === 'number' ||
          message.fallback_triggered) && (
          <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-400 px-1">
            {message.sufficient === true && (
              <Chip
                icon={<Sparkles className="h-3 w-3 text-emerald-400" />}
                label="Full Context"
                size="small"
                className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] h-5 font-medium"
              />
            )}

            {message.sufficient === false && (
              <Chip
                label="Partial Context"
                size="small"
                className="bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] h-5 font-medium"
              />
            )}

            {typeof message.retrieved_chunks_count === 'number' && (
              <span className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-mono text-[10px]">
                <FileText className="h-3 w-3 text-indigo-400" />
                <span>{message.retrieved_chunks_count} chunks referenced</span>
              </span>
            )}

            {message.fallback_triggered && (
              <Chip
                icon={<Search className="h-3 w-3 text-cyan-400" />}
                label="Extended Search Triggered"
                size="small"
                className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] h-5 font-medium"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
