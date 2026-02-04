/**
 * Root layout for the CreatorKit web app.
 *
 * Defines global fonts, metadata, and the main page scaffold.
 */
import type { Metadata } from 'next';
import { DM_Serif_Display, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '../components/toast';

const displayFont = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
});

const uiFont = Space_Grotesk({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'CreatorKit | Campaign Ops',
  description: 'Agency-grade campaign ops for creator teams.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${displayFont.variable} ${uiFont.variable}`}>
      <body className="font-sans">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
