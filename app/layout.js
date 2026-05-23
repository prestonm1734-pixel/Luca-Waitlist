import { Playfair_Display, DM_Mono } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  weight: ['300', '400', '500'],
  display: 'swap',
});

export const metadata = {
  title: 'Luca — The Autonomous Financial Agent',
  description:
    'Luca works in the background of your financial life. Canceling subscriptions, disputing fees, moving idle cash, optimizing debt. No spreadsheets. No advisors. Just results.',
  metadataBase: new URL('https://meet-luca.com'),
  openGraph: {
    title: 'Luca — The Autonomous Financial Agent',
    description: 'Your money, handled.',
    url: 'https://meet-luca.com',
    siteName: 'Luca',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmMono.variable}`}>
      <body
        className="font-mono antialiased overflow-x-hidden"
        style={{ background: '#0A0A0A', color: '#F5F5F3' }}
      >
        {children}
      </body>
    </html>
  );
}
