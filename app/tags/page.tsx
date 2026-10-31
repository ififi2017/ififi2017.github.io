import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getAllTags, getAllCategories } from '@/lib/posts';

export const metadata = { title: '标签' };

export default function TagsPage() {
  const tags = getAllTags();
  const categories = getAllCategories();

  return (
    <div className="rk-screen rk-tags-screen">
      <header className="rk-page-head">
        <div className="rk-section-tag">Topics</div>
        <h1 className="rk-page-title">标签</h1>
        <p className="rk-page-sub">从熟悉的主题开始，共 {tags.length} 个标签。</p>
      </header>

      <nav className="rk-year-index" aria-label="主题浏览">
        <a href="#topics">全部标签 <span>{tags.length}</span></a>
        <a href="#categories">按分类浏览 <span>{categories.length}</span></a>
      </nav>

      <section className="rk-topics" id="topics">
        <header className="rk-taxonomy-head">
          <h2>全部标签</h2>
          <span>{String(tags.length).padStart(2, '0')} 个标签</span>
        </header>
        <div className="rk-topic-grid">
          {tags.map(t => (
            <Link
              key={t.name}
              href={`/tags/${encodeURIComponent(t.name)}/`}
              className="rk-topic-link"
            >
              <span className="rk-topic-name">#{t.name}</span>
              <span className="rk-topic-meta">
                {String(t.count).padStart(2, '0')} 篇
                <ArrowUpRight className="rk-i" strokeWidth={1.75} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rk-cat-grid" id="categories">
        <header className="rk-taxonomy-head">
          <h2>分类</h2>
          <span>{String(categories.length).padStart(2, '0')} 个分类</span>
        </header>
        <div className="rk-cat-list">
          {categories.map(c => (
            <Link
              key={c.name}
              href={`/categories/${encodeURIComponent(c.name)}/`}
              className="rk-cat-card"
            >
              <div>
                <span className="rk-cat-label">分类</span>
                <div className="rk-cat-name">{c.name}</div>
              </div>
              <div className="rk-cat-meta">
                <span className="rk-cat-count">{String(c.count).padStart(2, '0')} 篇</span>
                <ArrowUpRight className="rk-i" strokeWidth={1.75} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
