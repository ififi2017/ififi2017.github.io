'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { Search, X } from 'lucide-react';

type PagefindResult = {
  id: string;
  data: () => Promise<{
    url: string;
    excerpt: string;
    meta: { title: string };
  }>;
};

type PagefindAPI = {
  search: (q: string) => Promise<{ results: PagefindResult[] }>;
};

type Hit = { id: string; title: string; url: string; excerpt: string };

declare global {
  interface Window { rkPagefind?: PagefindAPI }
}

// Lazy-load the pagefind module emitted into /_pagefind/ at build time.
// Use a `new Function` indirection so neither Webpack nor Turbopack tries to resolve
// the URL at bundle time — pagefind.js doesn't exist until `npm run build` finishes.
// In dev the file is absent and we render a notice instead.
const loadPagefind = async (): Promise<PagefindAPI | null> => {
  if (typeof window === 'undefined') return null;
  if (window.rkPagefind) return window.rkPagefind;
  try {
    const importer = new Function('url', 'return import(url)') as (url: string) => Promise<PagefindAPI>;
    const mod = await importer('/_pagefind/pagefind.js');
    window.rkPagefind = mod;
    return mod;
  } catch {
    return null;
  }
};

const normalizeUrl = (u: string) => u.replace(/\/index\.html?$/i, '/').replace(/\.html?$/i, '/');

export default function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<Hit[]>([]);
  const [ready, setReady] = useState<'init' | 'ok' | 'unavailable'>('init');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    loadPagefind().then(api => setReady(api ? 'ok' : 'unavailable'));
  }, [open]);

  useEffect(() => {
    if (!open || ready !== 'ok') return;
    let cancelled = false;
    const handle = setTimeout(async () => {
      if (!query.trim()) { setHits([]); return; }
      const api = await loadPagefind();
      if (!api || cancelled) return;
      const search = await api.search(query);
      const out: Hit[] = [];
      for (const r of search.results.slice(0, 8)) {
        const data = await r.data();
        out.push({
          id: r.id,
          title: data.meta.title || data.url,
          url: normalizeUrl(data.url),
          excerpt: data.excerpt,
        });
      }
      if (!cancelled) setHits(out);
    }, 120);
    return () => { cancelled = true; clearTimeout(handle); };
  }, [query, open, ready]);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <motion.div
            className="rk-search-overlay"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
          >
            <motion.div
              className="rk-search-dialog"
              role="dialog"
              aria-label="搜索"
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <header className="rk-search-head">
                <Search className="rk-i" strokeWidth={1.75} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="搜索文章…"
                  className="rk-search-input"
                  type="search"
                  autoComplete="off"
                />
                <kbd className="rk-search-esc">ESC</kbd>
                <button type="button" className="rk-search-close" onClick={onClose} aria-label="关闭">
                  <X className="rk-i" strokeWidth={1.75} />
                </button>
              </header>

              <div className="rk-search-results">
                {ready === 'unavailable' && (
                  <div className="rk-search-empty">
                    索引尚未生成。<br />
                    <span className="rk-search-empty-sub">
                      在生产构建中可用（<code>npm run build</code> 会写入 <code>out/_pagefind/</code>）。
                    </span>
                  </div>
                )}
                {ready === 'ok' && query.trim() && hits.length === 0 && (
                  <div className="rk-search-empty">没有匹配的结果。</div>
                )}
                {ready === 'ok' && !query.trim() && (
                  <div className="rk-search-empty">输入关键字开始搜索…</div>
                )}
                {hits.map(hit => (
                  <a key={hit.id} href={hit.url} className="rk-search-hit" onClick={onClose}>
                    <div className="rk-search-hit-title">{hit.title}</div>
                    <div className="rk-search-hit-excerpt" dangerouslySetInnerHTML={{ __html: hit.excerpt }} />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
