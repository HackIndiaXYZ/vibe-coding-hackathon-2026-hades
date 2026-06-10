'use client';
import { useState, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';

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
  const [isFocused, setIsFocused] = useState(false);

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
    <motion.div 
      animate={isFocused ? { scale: 1.01, boxShadow: "0 20px 40px -15px rgba(79,70,229,0.15)" } : { scale: 1, boxShadow: "0 8px 30px rgba(0,0,0,0.04)" }}
      transition={{ duration: 0.2 }}
      className="w-full rounded-2xl bg-white p-3 sm:p-4 transition-colors"
    >
      <textarea
        className="w-full resize-none border-none outline-none text-base min-h-[60px] sm:min-h-[80px] bg-transparent text-zinc-800 placeholder:text-zinc-300 font-sans"
        placeholder="e.g. Split a $150 dinner among 5 people, Sarah only had drinks..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={loading}
      />
      
      <div className="mt-2 pt-3 border-t border-zinc-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <motion.button
              key={example.label}
              type="button"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              onClick={() => setValue(example.prompt)}
              className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer px-2 py-1"
              disabled={loading}
            >
              {example.label}
            </motion.button>
          ))}
        </div>
        
        <div className="shrink-0 w-full sm:w-auto flex justify-end">
          {loading ? (
            <div className="px-5 py-2 flex items-center justify-center min-w-[160px] gap-1.5 h-[36px]">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                  className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]"
                />
              ))}
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
    </motion.div>
  );
}
