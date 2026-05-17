import { getAllTags, getAllCategories } from '@/lib/posts';

export const metadata = { title: '标签' };

const sizeFor = (count: number) => {
  const base = 14;
  const grown = base + count * 4;
  return Math.min(grown, 38);
};

export default function TagsPage() {
  const tags = getAllTags();
  const categories = getAllCategories();

  return (
    <div className="rk-screen rk-tags-screen">
      <header className="rk-page-head">
        <div className="rk-section-tag">TAGS</div>
        <h1 className="rk-page-title">标签 · <em>by topic</em></h1>
        <p className="rk-page-sub">大小代表文章数量。共 {tags.length} 个标签。</p>
      </header>

      <div className="rk-tag-cloud">
        {tags.map(t => (
          <span key={t.name} className="rk-tag-link" style={{ fontSize: `${sizeFor(t.count)}px` }}>
            #{t.name}
            <span className="rk-tag-count">{t.count}</span>
          </span>
        ))}
      </div>

      <div className="rk-rule" />

      <section className="rk-cat-grid">
        <h3 className="rk-section-title">分类</h3>
        <div className="rk-cat-list">
          {categories.map(c => (
            <div key={c.name} className="rk-cat-card">
              <div className="rk-cat-name">{c.name}</div>
              <div className="rk-cat-count">{String(c.count).padStart(2, '0')} 篇</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
