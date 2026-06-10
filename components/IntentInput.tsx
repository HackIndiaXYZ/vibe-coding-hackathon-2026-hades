'use client';
import { useState, KeyboardEvent } from 'react';

interface IntentInputProps {
  onSubmit: (prompt: string) => void;
  loading: boolean;
}

const EXAMPLES = [
  {
    label: "Split dinner bill",
    prompt: "Split a $150 dinner bill among 5 people. Sarah only had drinks so she pays half. Dave owes me $10 from last week."
  },
  {
    label: "25-min Pomodoro timer",
    prompt: "Build a Pomodoro timer: 25 minutes focus, then 5 minute break. Show progress visually."
  },
  {
    label: "Convert miles ↔ km",
    prompt: "Build a converter between miles, kilometres, and steps. Typing in any field updates the others."
  },
  {
    label: "Word + reading time counter",
    prompt: "Count words, characters, sentences, and estimated reading time for a piece of text I paste in."
  },
  {
    label: "Tip calculator",
    prompt: "Tip calculator: $85 bill, split among 4 people, let me choose tip percentage with a slider."
  }
];

export default function IntentInput({ onSubmit, loading }: IntentInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value.trim() || loading) return;
    onSubmit(value.trim());
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 p-3 sm:p-4 transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400">
      <textarea
        className="w-full resize-none border-none outline-none text-base min-h-[60px] sm:min-h-[80px] bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
        placeholder="e.g. Split a $150 dinner among 5 people, Sarah only had drinks..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
      
      <div className="mt-2 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example.label}
              type="button"
              onClick={() => setValue(example.prompt)}
              className="text-xs rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1 cursor-pointer hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-colors bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
              disabled={loading}
            >
              {example.label}
            </button>
          ))}
        </div>
        
        <div className="shrink-0 w-full sm:w-auto flex justify-end">
          {loading ? (
            <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-2 flex items-center justify-center min-w-[160px]">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" style={{ animationName: 'shimmer', animationDuration: '1.5s', animationIterationCount: 'infinite' }} />
              <style>{`
                @keyframes shimmer {
                  100% { transform: translateX(100%); }
                }
              `}</style>
              <span className="relative text-sm text-gray-500 dark:text-gray-400 font-medium z-10">Generating your UI...</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!value.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Generate UI
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
