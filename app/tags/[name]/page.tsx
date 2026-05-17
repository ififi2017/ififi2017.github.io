import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getAllPosts, getAllTags } from '@/lib/posts';

type RouteParams = { name: string };
type PageProps = { params: Promise<RouteParams> };

export async function generateStaticParams(): Promise<RouteParams[]> {
  // Use the raw tag name so the on-disk folder is UTF-8 (e.g. "黑苹果").
  // See note in app/categories/[name]/page.tsx — GitHub Pages decodes the URL
  // before matching, so percent-encoded requests still hit the right file.
  return getAllTags().map(t => ({ name: t.name }));
}

export async function generateMetadata({ params }: PageProps) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  return { title: `标签 · ${decoded}` };
}

export default async function TagPage({ params }: PageProps) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  const posts = getAllPosts().filter(p => p.tags.includes(decoded));
  if (posts.length === 0) notFound();

  return (
    <div className="rk-screen rk-archive">
      <Link href="/tags/" className="rk-back">
        <ArrowLeft className="rk-i" strokeWidth={1.75} /> 标签
      </Link>

      <header className="rk-page-head">
        <div className="rk-section-tag">TAG</div>
        <h1 className="rk-page-title">#{decoded}</h1>
        <p className="rk-page-sub">共 {posts.length} 篇带此标签的文章。</p>
      </header>

      <ol className="rk-archive-list">
        {posts.map(p => (
          <li key={p.slug}>
            <Link href={`/posts/${p.slug}/`} className="rk-archive-link">
              <span className="rk-archive-date">{p.date.slice(5).replace('-', ' · ')}</span>
              <span className="rk-archive-title">{p.title}</span>
              <span className="rk-archive-cat">
                {p.category}
                <ArrowRight className="rk-i rk-archive-arrow" strokeWidth={1.75} />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
