import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getAllPosts, getAllCategories } from '@/lib/posts';

type RouteParams = { name: string };
type PageProps = { params: Promise<RouteParams> };

export async function generateStaticParams(): Promise<RouteParams[]> {
  // Use the raw category name (e.g. "项目") so Next.js writes a UTF-8 directory.
  // GitHub Pages decodes the requested URL before matching, so a request for
  // /categories/%E9%A1%B9%E7%9B%AE/ resolves to /categories/项目/index.html.
  return getAllCategories().map(c => ({ name: c.name }));
}

export async function generateMetadata({ params }: PageProps) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  return { title: `分类 · ${decoded}` };
}

export default async function CategoryPage({ params }: PageProps) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  const posts = getAllPosts().filter(p => p.category === decoded);
  if (posts.length === 0) notFound();

  return (
    <div className="rk-screen rk-archive">
      <Link href="/tags/" className="rk-back">
        <ArrowLeft className="rk-i" strokeWidth={1.75} /> 分类
      </Link>

      <header className="rk-page-head">
        <div className="rk-section-tag">CATEGORY</div>
        <h1 className="rk-page-title">{decoded}</h1>
        <p className="rk-page-sub">共 {posts.length} 篇文章。</p>
      </header>

      <ol className="rk-archive-list">
        {posts.map(p => (
          <li key={p.slug}>
            <Link href={`/posts/${p.slug}/`} className="rk-archive-link">
              <span className="rk-archive-date">{p.date.slice(5).replace('-', ' · ')}</span>
              <span className="rk-archive-title">{p.title}</span>
              <span className="rk-archive-cat">
                <ArrowRight className="rk-i rk-archive-arrow" strokeWidth={1.75} />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
