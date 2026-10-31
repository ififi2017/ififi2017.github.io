import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Rss } from 'lucide-react';
import PostCard from '@/components/PostCard';
import { getAllPosts } from '@/lib/posts';
import { getProfile } from '@/lib/site';

export default function HomePage() {
  const profile = getProfile();
  const { studio } = profile;
  const posts = getAllPosts().slice(0, 6);
  const [featured, ...recent] = posts;

  return (
    <div className="rk-screen rk-home rk-home-journal">
      <header className="rk-mast">
        <div className="rk-mast-main">
          <p className="rk-mast-kicker">fi_niaR 的笔记 · 2017 年至今</p>
          <h1>把折腾的过程，认真写下来</h1>
          <p className="rk-mast-sub">关于代码、影像，以及那些值得留下的过程</p>
        </div>
        <div className="rk-mast-aside">
          <p className="rk-mast-motto">Write it down,{' '}<br />if it rains.</p>
          <a href="/rss.xml" className="rk-mast-rss"><Rss className="rk-i" strokeWidth={1.75} /> 订阅 RSS</a>
        </div>
      </header>

      {featured && (
        <section className="rk-lead" aria-label="最新文章">
          <Link href={`/posts/${featured.slug}/`} className="rk-lead-link">
            <div className="rk-lead-media">
              {featured.coverImage ? (
                <img src={featured.coverImage} alt="" loading="eager" decoding="async" />
              ) : (
                <div className="rk-featured-fallback" aria-hidden="true" />
              )}
            </div>
            <div className="rk-lead-copy">
              <p className="rk-lead-meta">
                <span className="rk-lead-badge">最新</span>
                <span>{featured.category}</span>
                <time dateTime={featured.date}>{featured.date.replace(/-/g, '.')}</time>
                <span>{featured.readingMinutes} 分钟阅读</span>
              </p>
              <h2>{featured.title}</h2>
              <p className="rk-lead-excerpt">{featured.excerpt}</p>
              <span className="rk-lead-cta">
                读这篇 <ArrowUpRight className="rk-i" strokeWidth={1.75} />
              </span>
            </div>
          </Link>
        </section>
      )}

      <div className="rk-journal-columns">
        <section className="rk-entries" aria-labelledby="home-recent-title">
          <header className="rk-entries-head">
            <h2 id="home-recent-title">最近写下的</h2>
            <Link href="/archive/" className="rk-link-btn">
              全部归档 <ArrowUpRight className="rk-i" strokeWidth={1.75} />
            </Link>
          </header>
          <ol className="rk-entry-list">
            {recent.map(p => <li key={p.slug}><PostCard post={p} /></li>)}
          </ol>
        </section>

        <aside className="rk-side">
          <section className="rk-side-block" aria-labelledby="home-about-title">
            <Link href="/bio/" className="rk-side-person">
              <Image src="/avatar-96.png" alt="" width={48} height={48} />
              <span>
                <span id="home-about-title" className="rk-side-name">{profile.name}</span>
                <span className="rk-side-handle">{profile.handle}</span>
              </span>
            </Link>
            <p className="rk-side-copy">这里留下过程，工作室里放着作品。</p>
            <Link href="/bio/" className="rk-link-btn">关于我 <ArrowUpRight className="rk-i" strokeWidth={1.75} /></Link>
          </section>

          <section className="rk-side-block" aria-labelledby="home-studio-title">
            <p className="rk-side-label">写作之外</p>
            <h2 id="home-studio-title" className="rk-side-title">{studio.name}</h2>
            <p className="rk-side-copy">{studio.description}</p>
            <ul className="rk-side-projects">
              {studio.projects.map(project => (
                <li key={project.name}>
                  <a href={project.url}>
                    <span className="rk-side-project-name">
                      {project.name}
                      <ArrowUpRight className="rk-i" strokeWidth={1.75} />
                    </span>
                    <span className="rk-side-project-meta">
                      <span className={`rk-status${project.status === '已上架' ? ' is-live' : ''}`} aria-hidden="true" />
                      {project.type} · {project.status}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <a href={studio.url} className="rk-link-btn">逛逛工作室 <ArrowUpRight className="rk-i" strokeWidth={1.75} /></a>
          </section>
        </aside>
      </div>
    </div>
  );
}
