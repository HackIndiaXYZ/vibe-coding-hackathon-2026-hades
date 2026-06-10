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
    <div className="w-full rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white p-3 sm:p-4 transition-all focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      <textarea
        className="w-full resize-none border-none outline-none text-base min-h-[60px] sm:min-h-[80px] bg-transparent text-zinc-800 placeholder:text-zinc-300 font-sans"
        placeholder="e.g. Split a $150 dinner among 5 people, Sarah only had drinks..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
      
      <div className="mt-2 pt-3 border-t border-zinc-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example.label}
              type="button"
              onClick={() => setValue(example.prompt)}
              className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer px-2 py-1"
              disabled={loading}
            >
              {example.label}
            </button>
          ))}
        </div>
        
        <div className="shrink-0 w-full sm:w-auto flex justify-end">
          {loading ? (
            <div className="relative overflow-hidden bg-zinc-100 rounded-lg px-5 py-2 flex items-center justify-center min-w-[160px]">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" style={{ animationName: 'shimmer', animationDuration: '1.5s', animationIterationCount: 'infinite' }} />
              <style>{`
                @keyframes shimmer {
                  100% { transform: translateX(100%); }
                }
              `}</style>
              <span className="relative text-sm text-zinc-500 font-medium z-10">Generating UI...</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!value.trim()}
              className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg px-5 py-2 text-sm font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate UI
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
