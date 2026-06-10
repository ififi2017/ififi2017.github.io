import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getAllPosts, getAllTags } from '@/lib/posts';

type RouteParams = { name: string };
type PageProps = { params: Promise<RouteParams> };

export async function generateStaticParams(): Promise<RouteParams[]> {
  const tags = getAllTags().map(({ name }) => ({ name }));
  if (process.env.NODE_ENV !== 'development') return tags;

  // Next.js dev compares the encoded request pathname against generated paths
  // when output: export is enabled. Include encoded aliases only in development;
  // production keeps the clean UTF-8 directories used by GitHub Pages.
  return tags.flatMap(({ name }) => {
    const encoded = encodeURIComponent(name);
    return encoded === name ? [{ name }] : [{ name }, { name: encoded }];
  });
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
    <div className="rk-screen rk-archive rk-taxonomy-page">
      <Link href="/tags/" className="rk-back">
        <ArrowLeft className="rk-i" strokeWidth={1.75} /> 标签
      </Link>

      <header className="rk-page-head">
        <div className="rk-section-tag">TAG</div>
        <h1 className="rk-page-title">#{decoded}</h1>
        <p className="rk-archive-signature">Writing connected by one topic.</p>
        <p className="rk-page-sub">共 {posts.length} 篇带此标签的文章。</p>
      </header>

      <ol className="rk-archive-list">
        {posts.map(p => (
          <li key={p.slug}>
            <Link href={`/posts/${p.slug}/`} className="rk-archive-link">
              <span className="rk-archive-meta">
                <span className="rk-archive-date">{p.date.replace(/-/g, '.')}</span>
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
    </div>
  );
}
