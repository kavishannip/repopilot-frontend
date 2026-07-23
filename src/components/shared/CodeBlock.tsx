'use client';

import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip } from '@wso2/oxygen-ui';
import { Check, Copy } from 'lucide-react';
import { codeToHtml } from 'shiki';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  maxHeight?: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({
  code,
  language = 'text',
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
    <div className={cn('relative group rounded-lg overflow-hidden border border-slate-800 bg-slate-950', className)}>
      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900/90 border-b border-slate-800/80 text-xs text-slate-400 font-mono">
        <span>{language}</span>
        <Tooltip title={copied ? 'Copied!' : 'Copy code'}>
          <IconButton
            size="small"
            onClick={handleCopy}
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 p-1"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </IconButton>
        </Tooltip>
      </div>

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
