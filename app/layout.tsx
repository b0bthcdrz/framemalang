import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Frame Malang',
  description: 'Cerita Malang, Satu Frame Sekaligus'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
