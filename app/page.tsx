import Link from 'next/link';
import { ArrowUpRight, Rss } from 'lucide-react';
import PostCard from '@/components/PostCard';
import { getAllPosts } from '@/lib/posts';

export default function HomePage() {
  const posts = getAllPosts().slice(0, 6);
  const [featured, ...recent] = posts;

  return (
    <div className="rk-screen rk-home">
      <section className="rk-home-hero">
        <div className="rk-home-intro">
          <div className="rk-home-kicker">fi_niaR / Personal blog since 2017</div>
          <h1 className="rk-home-title">
            <span className="rk-home-title-line">把折腾的过程，</span>
            <span className="rk-home-title-line rk-home-title-em">认真写下来。</span>
          </h1>
          <p className="rk-home-signature">Write it down, if it rains.</p>
          <p className="rk-home-sub">
            关于代码、影像，以及那些值得留下的过程。
          </p>
          <div className="rk-home-actions">
            <Link href="/archive/" className="rk-btn rk-btn-primary">
              浏览归档 <ArrowUpRight className="rk-i" strokeWidth={1.75} />
            </Link>
            <a href="/rss.xml" className="rk-btn rk-btn-ghost">
              <Rss className="rk-i" strokeWidth={1.75} /> 订阅 RSS
            </a>
          </div>
        </div>

        {featured && (
          <article className="rk-featured">
            <Link href={`/posts/${featured.slug}/`} className="rk-featured-link">
              <div className="rk-featured-media">
                {featured.coverImage ? (
                  <img src={featured.coverImage} alt="" loading="eager" decoding="async" />
                ) : (
                  <div className="rk-featured-fallback" aria-hidden="true" />
                )}
                <span className="rk-featured-label">最新文章</span>
              </div>
              <div className="rk-featured-copy">
                <div className="rk-featured-meta">
                  <span>{featured.category}</span>
                  <span>{featured.date.replace(/-/g, '.')}</span>
                  <span>{featured.readingMinutes} min read</span>
                </div>
                <h2>{featured.title}</h2>
                <p>{featured.excerpt}</p>
                <span className="rk-featured-cta">
                  阅读文章 <ArrowUpRight className="rk-i" strokeWidth={1.75} />
                </span>
              </div>
            </Link>
          </article>
        )}
      </section>

      <section className="rk-home-list">
        <header className="rk-list-head">
          <div>
            <h2 className="rk-section-title">最近写下的</h2>
            <p className="rk-section-sub">技术笔记、项目记录和生活切片。</p>
          </div>
          <Link href="/archive/" className="rk-link-btn">
            查看全部 <ArrowUpRight className="rk-i" strokeWidth={1.75} />
          </Link>
        </header>

        <div className="rk-card-stack">
          {recent.map(p => <PostCard key={p.slug} post={p} />)}
        </div>
      </section>
    </div>
  );
}
