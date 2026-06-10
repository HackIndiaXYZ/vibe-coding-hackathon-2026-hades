'use client';
import React, { useMemo, Component, ReactNode, useState } from 'react';
import { motion } from 'framer-motion';

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
      <motion.div
        layoutId="fluid-canvas"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isDismissing ? { opacity: 0, scale: 0.97 } : { opacity: 1, scale: 1 }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        className="relative p-[1px] rounded-2xl overflow-hidden w-full"
      >
        <div className="absolute inset-[-100%] z-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(79,70,229,1)_360deg)] animate-[spin_4s_linear_infinite]" />
        
        <div className="relative z-10 bg-white rounded-[15px] overflow-hidden w-full h-full">
          <Component onDismiss={handleDismiss} />
        </div>
      </motion.div>
    </ErrorBoundary>
  );
}
