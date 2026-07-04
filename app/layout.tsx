import type { Metadata, Viewport } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
// Self-hosted CJK serif for the reading surface (sliced by unicode-range,
// so readers only download the glyph ranges a page actually uses).
import '@fontsource/noto-serif-sc/400.css';
import '@fontsource/noto-serif-sc/600.css';
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
  alternates: {
    types: {
      'application/rss+xml': [{ url: '/rss.xml', title: 'fi_niaR RSS' }],
    },
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

// 隐私友好的轻量访问统计（无 cookie）。在 https://www.goatcounter.com 注册后
// 把站点代码填到这里（例如注册的是 rainif.goatcounter.com 就填 'rainif'）。
// 留空则完全不加载统计脚本。
const GOATCOUNTER_CODE = '';

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
        {GOATCOUNTER_CODE && (
          <script
            async
            data-goatcounter={`https://${GOATCOUNTER_CODE}.goatcounter.com/count`}
            src="https://gc.zgo.at/count.js"
          />
        )}
      </body>
    </html>
  );
}
