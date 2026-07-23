'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import { cn } from '@/lib/utils';

interface MarkdownProps {
  content: string;
  className?: string;
}

export default function Markdown({ content, className }: MarkdownProps) {
  if (!content) return null;

  return (
    <div className={cn('prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');

            if (match) {
              return <CodeBlock code={codeString} language={match[1]} className="my-3" />;
            }

            return (
              <code
                className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-xs border border-slate-700/60"
                {...props}
              >
                {children}
              </code>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors font-medium"
              >
                {children}
              </a>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4 border border-slate-800 rounded-lg">
                <table className="min-w-full divide-y divide-slate-800 text-left text-xs md:text-sm">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="px-4 py-2.5 bg-slate-900 font-semibold text-slate-200 border-b border-slate-800">
                {children}
              </th>
            );
          },
          td({ children }) {
            return <td className="px-4 py-2 border-b border-slate-800/60 text-slate-300">{children}</td>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-indigo-500/60 bg-indigo-500/5 px-4 py-2 my-3 rounded-r text-slate-300 italic">
                {children}
              </blockquote>
            );
          },
          h1({ children }) {
            return <h1 className="text-xl font-bold text-slate-100 mt-6 mb-3 tracking-tight">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-lg font-semibold text-slate-100 mt-5 mb-2.5 tracking-tight">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-base font-semibold text-slate-200 mt-4 mb-2 tracking-tight">{children}</h3>;
          },
          ul({ children }) {
            return <ul className="list-disc list-inside space-y-1.5 my-3 pl-1 text-slate-300">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside space-y-1.5 my-3 pl-1 text-slate-300">{olChildren(children)}</ol>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function olChildren(children: React.ReactNode) {
  return children;
}
