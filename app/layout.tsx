import type { Metadata, Viewport } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAF7' },
    { media: '(prefers-color-scheme: dark)', color: '#0E0E10' },
  ],
};

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
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
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
        </div>
      </body>
    </html>
  );
}
