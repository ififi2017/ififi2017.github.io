import Link from 'next/link';
import { ArrowRight, Rss } from 'lucide-react';
import PostCard from '@/components/PostCard';
import { getAllPosts } from '@/lib/posts';

export default function HomePage() {
  const posts = getAllPosts().slice(0, 6);

  return (
    <div className="rk-screen">
      <section className="rk-hero">
        <div className="rk-eyebrow">
          <span className="rk-eyebrow-dot" />
          <span>rainif.com · 自 2017</span>
        </div>
        <h1 className="rk-hero-title">
          write it down,<br />
          <em>if</em> it rains.
        </h1>
        <p className="rk-hero-sub">
          代码 · 视频 · 摄影 · 折腾。把值得留下的瞬间和过程记下来。<br />
        </p>
        <div className="rk-hero-actions">
          <Link href="/archive/" className="rk-btn rk-btn-primary">
            浏览归档 <ArrowRight className="rk-i" strokeWidth={1.75} />
          </Link>
          <a href="/rss.xml" className="rk-btn rk-btn-ghost">
            <Rss className="rk-i" strokeWidth={1.75} /> 订阅 RSS
          </a>
        </div>
      </section>

      <div className="rk-rule" />

      <section className="rk-list-section">
        <header className="rk-list-head">
          <div>
            <div className="rk-section-tag">RECENT</div>
            <h3 className="rk-section-title">最近写下的</h3>
          </div>
          <Link href="/archive/" className="rk-link-btn">归档 →</Link>
        </header>

        <div className="rk-card-stack">
          {posts.map(p => <PostCard key={p.slug} post={p} />)}
        </div>
      </section>
    </div>
  );
}
