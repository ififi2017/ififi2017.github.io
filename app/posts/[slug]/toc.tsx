'use client';

import { useEffect, useState } from 'react';
import type { TocItem } from '@/lib/posts';

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');

  useEffect(() => {
    if (items.length === 0) return;
    const headings = items
      .map(i => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );

    headings.forEach(h => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const list = (
    <ol className="rk-toc-list">
      {items.map(item => (
        <li
          key={item.id}
          className={item.id === activeId ? 'is-active' : ''}
          style={{ paddingLeft: item.level === 3 ? 12 : 0 }}
        >
          <a href={`#${item.id}`}>{item.text}</a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <aside className="rk-toc">
        <div className="rk-toc-label">CONTENTS</div>
        {list}
      </aside>
      {/* Collapsible fallback for narrow screens where the sidebar is hidden */}
      <details className="rk-toc-mobile">
        <summary>目录</summary>
        {list}
      </details>
    </>
  );
}
