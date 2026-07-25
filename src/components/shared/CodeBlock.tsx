'use client';

import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip } from '@wso2/oxygen-ui';
import { Check, Copy, FileCode } from 'lucide-react';
import { codeToHtml } from 'shiki';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  filePath?: string;
  className?: string;
  maxHeight?: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({
  code,
  language = 'text',
  filePath,
  className,
  maxHeight = '400px',
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function highlight() {
      try {
        const html = await codeToHtml(code, {
          lang: language || 'text',
          theme: 'github-dark-dimmed',
        });
        if (isMounted) setHighlightedHtml(html);
      } catch {
        if (isMounted) setHighlightedHtml(null);
      }
    }
    highlight();
    return () => {
      isMounted = false;
    };
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard error
    }
  };

  return (
    <div className={cn('relative group rounded-xl overflow-hidden border border-slate-800/90 bg-slate-950/90 shadow-md shadow-black/40 my-4', className)}>
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/95 border-b border-slate-800/80 text-xs font-mono">
        <div className="flex items-center gap-2 overflow-hidden">
          {filePath ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold text-[11px] truncate">
              <FileCode className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{filePath}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-slate-400">
              <FileCode className="h-3.5 w-3.5 text-slate-500" />
              <span>Repository Snippet</span>
            </div>
          )}

          {language && (
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-sans uppercase tracking-wider">
              {language}
            </span>
          )}
        </div>

        {/* Copy Snippet Button */}
        <Tooltip title={copied ? 'Copied to clipboard!' : 'Copy snippet'}>
          <button
            onClick={handleCopy}
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-300 hover:text-white transition-all text-xs font-sans font-medium"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>Copy Snippet</span>
              </>
            )}
          </button>
        </Tooltip>
      </div>

      {/* Code Body */}
      <div
        className="p-4 overflow-auto font-mono text-xs md:text-sm leading-relaxed text-slate-200"
        style={{ maxHeight }}
      >
        {highlightedHtml ? (
          <div dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
        ) : (
          <pre className="m-0 whitespace-pre">{code}</pre>
        )}
      </div>
    </div>
  );
}

