'use client';
import { useState } from 'react';
import Image from 'next/image';
import IntentInput from '@/components/IntentInput';
import DynamicRenderer from '@/components/DynamicRenderer';
import { motion } from 'framer-motion';

/* ─── Shimmer skeleton card ───────────────────────────────── */
function ShimmerCard() {
  return (
    <div className="w-full mt-4 bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8">
      <style>{`
        @keyframes shimmerSlide {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .shimmer-bar {
          background: linear-gradient(90deg, #f4f4f5 25%, #e4e4e7 50%, #f4f4f5 75%);
          background-size: 200% 100%;
          animation: shimmerSlide 1.5s infinite linear;
          border-radius: 4px;
        }
      `}</style>
      <div className="shimmer-bar h-4 w-3/4 mb-3" />
      <div className="shimmer-bar h-4 w-1/2" />
    </div>
  );
}

/* ─── History panel ───────────────────────────────────────── */
function HistoryPanel({
  open,
  onClose,
  history,
  onRerun,
}: {
  open: boolean;
  onClose: () => void;
  history: string[];
  onRerun: (prompt: string) => void;
}) {
  const recent = [...history].reverse().slice(0, 5);

  return (
    <>
      {/* Backdrop (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/10 sm:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full z-50 bg-white
                    border-l border-zinc-200 shadow-2xl
                    w-full sm:w-80 p-5 flex flex-col gap-4
                    transition-transform duration-300
                    ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-900 tracking-wide">
            Recent
          </span>
          <button
            id="history-close-btn"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 text-lg leading-none transition-colors cursor-pointer"
            aria-label="Close history panel"
          >
            ✕
          </button>
        </div>

        {/* List */}
        {recent.length === 0 ? (
          <p className="text-xs text-zinc-400 mt-2">
            No prompts yet. Generate a UI first!
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {recent.map((prompt, i) => (
              <li
                key={i}
                className="flex items-start justify-between gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-3"
              >
                <span className="text-xs text-zinc-600 leading-relaxed flex-1 break-words">
                  {prompt.length > 45 ? prompt.slice(0, 45) + '…' : prompt}
                </span>
                <button
                  onClick={() => { onRerun(prompt); onClose(); }}
                  className="shrink-0 text-xs text-zinc-900 hover:underline font-medium cursor-pointer"
                  aria-label={`Re-run: ${prompt.slice(0, 30)}`}
                >
                  ↩ Re-run
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

/* ─── Main page ───────────────────────────────────────────── */
export default function Home() {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  const handleSubmit = async (prompt: string) => {
    setLoading(true);
    setOutput(''); // clear previous output so shimmer shows
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API request failed:', errorText);
        alert(`API Error: ${errorText}`);
        // Set output to a string that compiles but throws inside rendering, triggering the ErrorBoundary
        setOutput("function MicroUI() { throw new Error('API Error: " + errorText.replace(/'/g, "\\'") + "'); }");
        return;
      }

      const text = await response.text();
      setOutput(text);
      setHistory((prev) => [...prev, prompt]);
    } catch (error: any) {
      const msg = error?.message || String(error);
      console.error('Failed to generate UI due to exception:', error);
      alert(`System Error: ${msg}`);
      setOutput("function MicroUI() { throw new Error('System Error: " + msg.replace(/'/g, "\\'") + "'); }");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen w-full flex flex-col relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/40 via-zinc-50 to-white font-sans"
    >
      <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-2xl flex flex-col items-center gap-8 z-10">

          {/* Hero Brand */}
          <div className="flex flex-col items-center gap-3 text-center w-full">
            {/* Logo + FLUID wordmark */}
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <Image
                  src="/icon.png"
                  alt="Fluid logo"
                  width={56}
                  height={56}
                  className="rounded-2xl shadow-lg"
                  priority
                />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
                className="text-6xl sm:text-7xl font-extrabold tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500"
              >
                FLUID
              </motion.span>
            </div>
            <h1 className="text-3xl font-light text-zinc-900 leading-tight">
              Tell me what you need.{' '}
              <br className="sm:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 via-indigo-400 to-zinc-400 bg-[length:200%_auto] animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite,text-shimmer_4s_ease_infinite]">I'll build the interface.</span>
            </h1>
          </div>

          {/* Input */}
          <div className="w-full">
            <IntentInput onSubmit={handleSubmit} loading={loading} />
          </div>

          {/* Shimmer while loading */}
          {loading && <ShimmerCard />}

          {/* Output */}
          {!loading && output && (
            <div className="w-full mt-4 bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-4 duration-500">
              <DynamicRenderer
                code={output}
                onDismiss={() => setOutput('')}
              />
            </div>
          )}

        </div>
      </div>

      {/* Footer removed */}

      {/* History ghost button */}
      {history.length > 0 && (
        <button
          id="history-toggle-btn"
          onClick={() => setHistoryOpen(true)}
          className="fixed bottom-6 right-6 z-40 text-xs border border-zinc-200 rounded-full px-3 py-1.5 bg-white text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-colors shadow-sm cursor-pointer"
          aria-label="Open history panel"
        >
          History
        </button>
      )}

      {/* History panel */}
      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onRerun={handleSubmit}
      />
    </motion.main>
  );
}
