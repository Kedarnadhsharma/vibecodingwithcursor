import type { Metadata } from 'next';
import './globals.css';
import SessionProvider from './providers/SessionProvider';

export const metadata: Metadata = {
  title: 'Vibe Coding Starter',
  description: 'A lightweight Next.js starter template.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}

