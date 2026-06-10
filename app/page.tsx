'use client';
import { useState } from 'react';
import IntentInput from '@/components/IntentInput';
import DynamicRenderer from '@/components/DynamicRenderer';

/* ─── Shimmer skeleton card ───────────────────────────────── */
function ShimmerCard() {
  return (
    <div className="w-full mt-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm p-6 sm:p-8">
      <style>{`
        @keyframes shimmerSlide {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .shimmer-bar {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmerSlide 1.5s infinite linear;
          border-radius: 4px;
        }
        .dark .shimmer-bar {
          background: linear-gradient(90deg, #1f2937 25%, #374151 50%, #1f2937 75%);
          background-size: 200% 100%;
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
          className="fixed inset-0 z-40 bg-black/20 sm:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full z-50 bg-white dark:bg-gray-900
                    border-l border-gray-200 dark:border-gray-800 shadow-xl
                    w-full sm:w-80 p-5 flex flex-col gap-4
                    transition-transform duration-300
                    ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">
            Recent
          </span>
          <button
            id="history-close-btn"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg leading-none transition-colors"
            aria-label="Close history panel"
          >
            ✕
          </button>
        </div>

        {/* List */}
        {recent.length === 0 ? (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            No prompts yet. Generate a UI first!
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {recent.map((prompt, i) => (
              <li
                key={i}
                className="flex items-start justify-between gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-3"
              >
                <span className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed flex-1 break-words">
                  {prompt.length > 45 ? prompt.slice(0, 45) + '…' : prompt}
                </span>
                <button
                  onClick={() => { onRerun(prompt); onClose(); }}
                  className="shrink-0 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
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

      const text = await response.text();
      setOutput(text);
      setHistory((prev) => [...prev, prompt]);
    } catch (error) {
      console.error('Failed to generate UI:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col relative bg-gray-50 dark:bg-gray-950">
      <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-2xl flex flex-col items-center gap-8 z-10">

          {/* Tagline */}
          <div className="flex flex-col items-center gap-4 text-center w-full">
            <span className="tracking-widest text-xs text-gray-400 font-medium uppercase">
              Fluid
            </span>
            <h1 className="text-2xl sm:text-3xl font-light text-gray-900 dark:text-white leading-tight">
              Tell me what you need.{' '}
              <br className="sm:hidden" />
              <span className="text-indigo-600 dark:text-indigo-400">I'll build the interface.</span>
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
            <div className="w-full mt-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <DynamicRenderer
                code={output}
                onDismiss={() => setOutput('')}
              />
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 w-full text-center pb-4 text-xs text-gray-300 dark:text-gray-600">
        Built at HackIndia 2026 &middot; Fluid by Team Hades
      </div>

      {/* History ghost button */}
      {history.length > 0 && (
        <button
          id="history-toggle-btn"
          onClick={() => setHistoryOpen(true)}
          className="fixed bottom-6 right-6 z-40 text-xs border border-gray-300 dark:border-gray-700 rounded-full px-3 py-1.5 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm"
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
    </main>
  );
}
