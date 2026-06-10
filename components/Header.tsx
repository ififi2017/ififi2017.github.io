'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MotionConfig, motion } from 'motion/react';
import { Search, Sun, Moon } from 'lucide-react';
import SearchModal from '@/components/SearchModal';

const NAV = [
  { href: '/',        label: '首页' },
  { href: '/archive', label: '归档' },
  { href: '/tags',    label: '标签' },
  { href: '/bio',     label: '关于' },
];

const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname.startsWith(href);

export default function Header() {
  const pathname = usePathname() ?? '/';
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchShortcut, setSearchShortcut] = useState('⌘K');

  useEffect(() => {
    setMounted(true);
    const platform = navigator.platform || navigator.userAgent;
    setSearchShortcut(/Mac|iPhone|iPad|iPod/i.test(platform) ? '⌘K' : 'Ctrl K');
    const saved = typeof window !== 'undefined'
      ? (localStorage.getItem('rk-theme') as 'light' | 'dark' | null)
      : null;
    const prefersDark = typeof window !== 'undefined'
      && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const next = saved ?? (prefersDark ? 'dark' : 'light');
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(v => !v);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('rk-theme', next); } catch { /* ignore */ }
  };

  return (
    <>
      <header className="rk-header">
        <div className="rk-header-band" />
        <div className="rk-header-inner">
          <Link href="/" className="rk-brand">
            <span className="rk-brand-avatar">
              <Image
                src="/avatar-96.png"
                alt="fi niaR"
                width={96}
                height={96}
                priority
              />
            </span>
            <span className="rk-brand-word">
              fi_<span className="rk-brand-accent">niaR</span>
            </span>
          </Link>

          <MotionConfig reducedMotion="user">
            <nav className="rk-nav">
              {NAV.map(({ href, label }) => {
                const active = isActive(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`rk-nav-item ${active ? 'is-active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {active && (
                      <motion.span
                        layoutId="rk-nav-active"
                        className="rk-nav-indicator"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="rk-nav-label">{label}</span>
                  </Link>
                );
              })}
            </nav>
          </MotionConfig>

          <div className="rk-header-actions">
            <button
              type="button"
              className="rk-icon-btn rk-search-btn"
              title={`搜索 ${searchShortcut}`}
              onClick={() => setSearchOpen(true)}
            >
              <Search className="rk-i" strokeWidth={1.75} />
              <kbd>{searchShortcut}</kbd>
            </button>
            <button
              type="button"
              className="rk-icon-btn"
              title="切换主题"
              onClick={toggleTheme}
              aria-label="切换主题"
            >
              {mounted && theme === 'dark'
                ? <Sun className="rk-i" strokeWidth={1.75} />
                : <Moon className="rk-i" strokeWidth={1.75} />}
            </button>
          </div>
        </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
