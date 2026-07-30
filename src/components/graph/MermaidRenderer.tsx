'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Maximize2, Minimize2, Download, Copy, Check, RefreshCw } from 'lucide-react';

interface MermaidRendererProps {
  code: string;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export default function MermaidRenderer({ code, onRegenerate, isRegenerating }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!code) return;

    const renderDiagram = async () => {
      try {
        const mermaid = (await import('mermaid')).default;

        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            // Dark background
            background: '#0f172a',
            primaryColor: '#1e293b',
            primaryTextColor: '#f1f5f9',
            primaryBorderColor: '#334155',
            lineColor: '#6366f1',
            secondaryColor: '#1e3a5f',
            tertiaryColor: '#14532d',
            // Node colors
            nodeBorder: '#475569',
            clusterBkg: '#1e293b',
            clusterBorder: '#334155',
            titleColor: '#f8fafc',
            edgeLabelBackground: '#1e293b',
            // Text
            fontFamily: 'Inter, ui-sans-serif, system-ui',
            fontSize: '14px',
          },
          flowchart: {
            htmlLabels: true,
            curve: 'basis',
            nodeSpacing: 60,
            rankSpacing: 80,
          },
          securityLevel: 'loose',
        });

        setRenderError(null);

        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, code);
        setSvgContent(svg);
      } catch (err) {
        console.error('Mermaid render error:', err);
        setRenderError(err instanceof Error ? err.message : 'Failed to render diagram');
      }
    };

    renderDiagram();
  }, [code]);

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [code]);

  const handleDownloadSVG = useCallback(() => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'architecture-diagram.svg';
    a.click();
    URL.revokeObjectURL(url);
  }, [svgContent]);

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.2, 3));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.2, 0.3));
  const handleResetZoom = () => setScale(1);

  if (renderError) {
    return (
      <div className="flex flex-col gap-3">
        {/* Error state with raw code fallback */}
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-sm">
          <p className="font-semibold mb-1">Diagram render error</p>
          <p className="text-xs text-red-400">{renderError}</p>
        </div>
        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto">
          {code}
        </pre>
        {onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="self-start flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-xs font-medium hover:bg-indigo-600/30 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            Regenerate Diagram
          </button>
        )}
      </div>
    );
  }

  const DiagramContent = (
    <div
      ref={containerRef}
      className="overflow-auto w-full"
      style={{ minHeight: '300px' }}
    >
      <div
        style={{ transform: `scale(${scale})`, transformOrigin: 'top center', transition: 'transform 0.2s ease' }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
        className="[&>svg]:w-full [&>svg]:max-w-none [&>svg]:h-auto [&>svg]:rounded-lg"
      />
    </div>
  );

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        {/* Zoom controls */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800">
          <button
            type="button"
            onClick={handleZoomOut}
            className="px-2 py-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-sm font-mono transition-colors"
            title="Zoom out"
          >
            −
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            className="px-2 py-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs transition-colors min-w-[48px] text-center"
            title="Reset zoom"
          >
            {Math.round(scale * 100)}%
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            className="px-2 py-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-sm font-mono transition-colors"
            title="Zoom in"
          >
            +
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs font-medium transition-colors disabled:opacity-50"
              title="Regenerate diagram"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs font-medium transition-colors"
            title="Copy Mermaid code"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
          {svgContent && (
            <button
              type="button"
              onClick={handleDownloadSVG}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs font-medium transition-colors"
              title="Download as SVG"
            >
              <Download className="h-3.5 w-3.5" />
              <span>SVG</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs font-medium transition-colors"
            title="Fullscreen"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Diagram canvas */}
      <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-auto p-4" style={{ minHeight: '350px' }}>
        {svgContent ? (
          DiagramContent
        ) : (
          <div className="flex items-center justify-center h-60">
            <div className="flex flex-col items-center gap-3 text-slate-500">
              <div className="w-8 h-8 border-2 border-indigo-500/50 border-t-indigo-400 rounded-full animate-spin" />
              <span className="text-xs">Rendering diagram...</span>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur flex flex-col"
          onClick={(e) => e.target === e.currentTarget && setIsFullscreen(false)}
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <h2 className="text-slate-200 font-semibold text-sm">Architecture Diagram</h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="px-2 py-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-sm font-mono transition-colors"
                >−</button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="px-2 py-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs transition-colors min-w-[48px] text-center"
                >
                  {Math.round(scale * 100)}%
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="px-2 py-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-sm font-mono transition-colors"
                >+</button>
              </div>
              {svgContent && (
                <button
                  type="button"
                  onClick={handleDownloadSVG}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>SVG</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-300 hover:bg-red-950/30 text-xs font-medium transition-colors"
              >
                <Minimize2 className="h-3.5 w-3.5" />
                <span>Exit</span>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-6">
            <div
              style={{ transform: `scale(${scale})`, transformOrigin: 'top center', transition: 'transform 0.2s ease' }}
              dangerouslySetInnerHTML={{ __html: svgContent }}
              className="[&>svg]:w-full [&>svg]:max-w-none [&>svg]:h-auto"
            />
          </div>
        </div>
      )}
    </>
  );
}
