import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getPostsByYear, getAllPosts } from '@/lib/posts';

export const metadata = { title: '归档' };

export default function ArchivePage() {
  const groups = getPostsByYear();
  const total = getAllPosts().length;

  return (
    <div className="rk-screen rk-archive">
      <header className="rk-page-head">
        <div className="rk-section-tag">ARCHIVE</div>
        <h1 className="rk-page-title">归档</h1>
        <p className="rk-archive-signature">Everything written, kept in order.</p>
        <p className="rk-page-sub">按时间倒序排列。共 {total} 篇。</p>
      </header>

      {groups.map(g => (
        <section className="rk-archive-year" key={g.year}>
          <div className="rk-archive-year-head">
            <span className="rk-archive-year-num">{g.year}</span>
            <span className="rk-archive-year-count">{String(g.posts.length).padStart(2, '0')} 篇</span>
          </div>
          <ol className="rk-archive-list">
            {g.posts.map(p => (
              <li key={p.slug}>
                <Link href={`/posts/${p.slug}/`} className="rk-archive-link">
                  <span className="rk-archive-meta">
                    <span className="rk-archive-date">{p.date.slice(5).replace('-', '.')}</span>
                    <span className="rk-archive-cat">{p.category}</span>
                    <span>{p.readingMinutes} 分钟</span>
                  </span>
                  <span className="rk-archive-main">
                    <span className="rk-archive-title">{p.title}</span>
                    <ArrowRight className="rk-i rk-archive-arrow" strokeWidth={1.75} />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
