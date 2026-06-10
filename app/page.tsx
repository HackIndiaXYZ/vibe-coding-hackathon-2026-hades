'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

const DynamicRenderer = dynamic(() => import('@/components/DynamicRenderer'), {
  ssr: false,
});

interface GeneratedUI {
  id: string;
  prompt: string;
  code: string;
  timestamp: Date;
}

const EXAMPLE_PROMPTS = [
  'A Pomodoro timer with start/pause/reset',
  'A color palette generator with hex codes',
  'A mood tracker with emoji buttons',
  'A minimalist to-do list with checkboxes',
  'A random quote generator with categories',
  'A BMI calculator with visual indicator',
];

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUIs, setGeneratedUIs] = useState<GeneratedUI[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [focusedExample, setFocusedExample] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const code = await res.text();
      if (!code || code.length < 20) throw new Error('Generated code was empty or too short.');

      const newUI: GeneratedUI = {
        id: crypto.randomUUID(),
        prompt: prompt.trim(),
        code,
        timestamp: new Date(),
      };

      setGeneratedUIs(prev => [newUI, ...prev]);
      setPrompt('');

      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDismiss = (id: string) => {
    setGeneratedUIs(prev => prev.filter(ui => ui.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.key === 'Enter' && (e.metaKey || e.ctrlKey))) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <main className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-lg" style={{ background: 'var(--accent)', opacity: 0.2, filter: 'blur(6px)' }} />
            <div className="relative w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent), #a78bfa)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
          </div>
          <span className="text-lg font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>Fluid</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--surface-2)', color: 'var(--accent)', border: '1px solid var(--border)' }}>
            AI-native
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
          Powered by Gemini 1.5 Flash
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 pt-20 pb-12 text-center">
        {/* Glow orbs */}
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,106,247,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="relative space-y-4 max-w-2xl">
          <h1 className="text-5xl font-bold tracking-tight leading-tight" style={{ background: 'linear-gradient(135deg, #f0f0f5 0%, #a78bfa 50%, #7c6af7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Type anything.<br />Get a living UI.
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            Describe what you want. Fluid generates a functional React component — live on screen.
          </p>
        </div>
      </section>

      {/* Input area */}
      <section className="flex flex-col items-center px-6 pb-12 gap-6 max-w-3xl mx-auto w-full">
        {/* Prompt input */}
        <div className="w-full rounded-2xl p-px" style={{ background: 'linear-gradient(135deg, var(--accent), #a78bfa, var(--border))' }}>
          <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: 'var(--surface)' }}>
            <textarea
              ref={textareaRef}
              id="prompt-input"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the UI you want… e.g. 'A Pomodoro timer with start/pause controls'"
              rows={2}
              className="w-full resize-none bg-transparent text-base outline-none placeholder:opacity-40 leading-relaxed"
              style={{ color: 'var(--foreground)', fontFamily: 'inherit', minHeight: '56px', maxHeight: '200px' }}
              disabled={isGenerating}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                ⌘ + Enter to generate
              </span>
              <button
                id="generate-btn"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: isGenerating || !prompt.trim()
                    ? 'var(--surface-2)'
                    : 'linear-gradient(135deg, var(--accent), #a78bfa)',
                  color: 'white',
                  boxShadow: isGenerating || !prompt.trim() ? 'none' : '0 0 20px var(--accent-glow)',
                }}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Example prompts */}
        <div className="w-full">
          <p className="text-xs font-medium mb-3 text-center" style={{ color: 'var(--text-muted)' }}>Try one of these</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {EXAMPLE_PROMPTS.map((ex, i) => (
              <button
                key={i}
                id={`example-${i}`}
                onClick={() => setPrompt(ex)}
                onMouseEnter={() => setFocusedExample(i)}
                onMouseLeave={() => setFocusedExample(null)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                style={{
                  background: focusedExample === i ? 'var(--surface-2)' : 'transparent',
                  color: focusedExample === i ? 'var(--accent)' : 'var(--text-muted)',
                  border: `1px solid ${focusedExample === i ? 'var(--accent)' : 'var(--border)'}`,
                }}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="w-full p-4 rounded-xl text-sm flex items-start gap-3" style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}
      </section>

      {/* Shimmer loader */}
      {isGenerating && (
        <section className="max-w-3xl mx-auto w-full px-6 pb-8">
          <div className="rounded-2xl overflow-hidden h-48" style={{
            background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface-2) 50%, var(--surface) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite linear',
          }} />
        </section>
      )}

      {/* Generated UIs output */}
      {generatedUIs.length > 0 && (
        <section ref={outputRef} className="max-w-3xl mx-auto w-full px-6 pb-16 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              {generatedUIs.length} generated UI{generatedUIs.length !== 1 ? 's' : ''}
            </span>
            <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
          </div>

          {generatedUIs.map((ui) => (
            <div key={ui.id} className="space-y-2" style={{ animation: 'fadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
              {/* Prompt label */}
              <div className="flex items-center gap-2 px-1">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--accent)', opacity: 0.9 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
                <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>{ui.prompt}</p>
                <span className="ml-auto text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>
                  {ui.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Rendered component */}
              <DynamicRenderer
                code={ui.code}
                onDismiss={() => handleDismiss(ui.id)}
              />
            </div>
          ))}
        </section>
      )}

      {/* Empty state */}
      {generatedUIs.length === 0 && !isGenerating && (
        <section className="flex-1 flex flex-col items-center justify-center pb-24 gap-4 opacity-30">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ border: '2px dashed var(--border)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6M9 12h6M9 15h4" />
            </svg>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Your generated UIs will appear here</p>
        </section>
      )}

      {/* Footer */}
      <footer className="text-center py-6 text-xs" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>
        Fluid · Built for Hack India 2026 · Powered by Gemini 1.5 Flash
      </footer>
    </main>
  );
}
