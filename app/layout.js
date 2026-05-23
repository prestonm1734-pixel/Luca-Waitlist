import { JetBrains_Mono } from 'next/font/google';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'Luca — Your Automated CFO',
  description:
    'Luca links securely to your existing bank accounts to instantly find and cancel forgotten subscriptions, recover hidden fees, and route your idle checking balance into high-yield spaces automatically.',
  metadataBase: new URL('https://meet-luca.com'),
  openGraph: {
    title: 'Luca — Your Automated CFO',
    description: 'Put your personal finances on autopilot.',
    url: 'https://meet-luca.com',
    siteName: 'Luca',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="bg-black text-white font-mono antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
