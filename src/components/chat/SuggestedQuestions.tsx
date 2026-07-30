'use client';

import React from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
  disabled?: boolean;
}

export default function SuggestedQuestions({ onSelectQuestion, disabled }: SuggestedQuestionsProps) {
  const deepAnalysisResult = useAppStore((state) => state.deepAnalysisResult);

  const patterns = (deepAnalysisResult?.detected_patterns || []).map((p) => p.toLowerCase());
  const projectTypes = (deepAnalysisResult?.project_types || []).map((t) => t.toLowerCase());

  const questions: string[] = [];

  // REST API project questions
  if (patterns.some((p) => p.includes('api') || p.includes('rest')) || projectTypes.some((t) => t.includes('backend') || t.includes('api'))) {
    questions.push('How does the API routing work?');
    questions.push("What's the request-response flow?");
  }

  // Database heavy project questions
  if (patterns.some((p) => p.includes('db') || p.includes('database') || p.includes('orm')) || projectTypes.some((t) => t.includes('database'))) {
    questions.push("What's the database schema and model structure?");
  }

  // Frontend / PWA questions
  if (projectTypes.some((t) => t.includes('frontend') || t.includes('pwa') || t.includes('react') || t.includes('next'))) {
    questions.push('How is state management and component structure organized?');
  }

  // Generic fallbacks
  if (questions.length < 3) {
    questions.push('What does this repository do and what are its core modules?');
    questions.push("What's the main entry point and setup flow?");
    questions.push('How is authentication and security handled?');
  }

  const selectedQuestions = Array.from(new Set(questions)).slice(0, 4);

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
        <span>Suggested Starter Questions</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {selectedQuestions.map((q) => (
          <button
            key={q}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onSelectQuestion(q)}
            className={`flex items-center gap-2 p-3 rounded-xl text-left text-xs font-medium transition-all group ${
              disabled
                ? 'bg-slate-900/40 border border-slate-800/50 text-slate-600 cursor-not-allowed opacity-60'
                : 'bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-indigo-300'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0" />
            <span className="line-clamp-2">{q}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
