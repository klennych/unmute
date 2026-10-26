import './globals.css';
import type { Metadata } from 'next';
import { Inter, Manrope, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-heading' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://unmuteduo.in'),
  title: {
    default: 'UNMUTE DUO | Speak Confidently & Be Heard',
    template: '%s | UNMUTE DUO',
  },
  description:
    "Improve your communication confidence with UNMUTE DUO's 14-day workshop. Explore speaking activities, workshop details, and Google Form registration.",
  keywords: [
    'communication workshop',
    'speaking confidence',
    'public speaking',
    'UNMUTE DUO',
    '14-day workshop',
  ],
  openGraph: {
    title: 'UNMUTE DUO | Speak Confidently & Be Heard',
    description:
      "Improve your communication confidence with UNMUTE DUO's 14-day workshop.",
    type: 'website',
    url: 'https://unmuteduo.in',
    siteName: 'UNMUTE DUO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UNMUTE DUO | Speak Confidently & Be Heard',
    description:
      "Improve your communication confidence with UNMUTE DUO's 14-day workshop.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${manrope.variable} ${playfair.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
