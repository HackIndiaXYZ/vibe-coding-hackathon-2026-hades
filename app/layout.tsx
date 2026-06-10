import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fluid — AI-Native UI Generator',
  description:
    'Type natural language and watch Fluid generate a live, functional React component in real time. Powered by Gemini 1.5 Flash.',
  keywords: ['AI', 'UI generator', 'React', 'Gemini', 'Fluid', 'no-code'],
  authors: [{ name: 'Hack India 2026' }],
  openGraph: {
    title: 'Fluid — AI-Native UI Generator',
    description: 'Describe any UI. Get a live React component instantly.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" style={{ colorScheme: 'dark' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
