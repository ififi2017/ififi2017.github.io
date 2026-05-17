import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Live2D from '@/components/Live2D';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://rainif.com'),
  title: {
    default: 'fi_niaR · a quiet corner',
    template: '%s · fi_niaR',
  },
  description: '关于 macOS、OpenCore、Hackintosh、与那些值得记下来的零碎。',
  authors: [{ name: 'fi niaR', url: 'https://github.com/ififi2017' }],
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'fi_niaR · a quiet corner',
    description: '关于 macOS、OpenCore、Hackintosh、与那些值得记下来的零碎。',
    url: 'https://rainif.com',
    siteName: 'fi_niaR',
    locale: 'zh_CN',
    type: 'website',
  },
};

const themeBootstrap = `
(function() {
  try {
    var saved = localStorage.getItem('rk-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) { /* ignore */ }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>
        <div className="rk-app">
          <Header />
          <main className="rk-main">{children}</main>
          <Footer />
          <Live2D />
        </div>
      </body>
    </html>
  );
}
