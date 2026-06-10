'use client';
import React, { useMemo, Component, ReactNode, useState } from 'react';

class ErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

export default function DynamicRenderer({
  code,
  onDismiss,
}: {
  code: string;
  onDismiss: () => void;
}) {
  const [isDismissing, setIsDismissing] = useState(false);

  const handleDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => {
      onDismiss();
    }, 200);
  };

  const Component = useMemo(() => {
    try {
      const fn = new Function(
        'React', 'useState', 'useEffect', 'useRef',
        `${code}\nreturn MicroUI;`
      );
      return fn(React, React.useState, React.useEffect, React.useRef);
    } catch (err) {
      console.error("🔥 Dynamic Compilation Failed!");
      console.error("The Error:", err);
      console.log("The Code Gemini Returned:\n", code);
      return null;
    }
  }, [code]);

  if (!Component) return (
    <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl font-sans">
      Couldn&apos;t render this UI — try rephrasing your request.
    </div>
  );

  return (
    <ErrorBoundary fallback={
      <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl font-sans">
        Something went wrong rendering this UI.
      </div>
    }>
      <div
        className={`animate-fadeUp transition-all duration-200
                    ${isDismissing
                      ? 'opacity-0 scale-[0.97]'
                      : 'opacity-100 scale-100'
                    }`}
      >
        <Component onDismiss={handleDismiss} />
      </div>
    </ErrorBoundary>
  );
}
