import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calendar, CalendarCheck, Folder, Clock } from 'lucide-react';
import TableOfContents from './toc';
import Comments from '@/components/Comments';
import PostZoom from '@/components/PostZoom';
import PostViews from '@/components/PostViews';
import CodeBlock from '@/components/CodeBlock';
import { getAllPosts, getPost, type PostMeta } from '@/lib/posts';

type RouteParams = { slug: string };
type PageProps = { params: Promise<RouteParams> };

export async function generateStaticParams(): Promise<RouteParams[]> {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: '未找到' };
  const url = `/posts/${slug}/`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      tags: post.tags,
      ...(post.coverImage ? { images: [post.coverImage] } : {}),
    },
    twitter: {
      card: post.coverImage ? 'summary_large_image' : 'summary',
      title: post.title,
      description: post.excerpt,
    },
  };
}

const formatDate = (d: string) => d.replace(/-/g, '.');

/** Posts sharing the most tags first (same category breaks ties), newest wins. */
const relatedPosts = (post: PostMeta, all: PostMeta[], limit = 3): PostMeta[] =>
  all
    .filter(p => p.slug !== post.slug)
    .map(p => ({
      p,
      score:
        p.tags.filter(t => post.tags.includes(t)).length +
        (p.category === post.category ? 0.5 : 0),
    }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score || (a.p.date < b.p.date ? 1 : -1))
    .slice(0, limit)
    .map(x => x.p);

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  // getAllPosts() is sorted newest-first, so idx-1 is the newer neighbour.
  const all = getAllPosts();
  const idx = all.findIndex(p => p.slug === slug);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
  const related = relatedPosts(post, all);

  return (
    <div className="rk-screen rk-post">
      <Link href="/" className="rk-back">
        <ArrowLeft className="rk-i" strokeWidth={1.75} /> 返回
      </Link>

      <header className="rk-post-header">
        <div className="rk-post-meta">
          <span className="rk-meta-group">
            <span className="rk-meta-item">
              <Calendar className="rk-i" strokeWidth={1.75} />{formatDate(post.date)}
            </span>
            {post.updated && (
              <span className="rk-meta-item">
                <CalendarCheck className="rk-i" strokeWidth={1.75} />更新于 {formatDate(post.updated)}
              </span>
            )}
          </span>

          <span className="rk-meta-group">
            <span className="rk-meta-item">
              <Folder className="rk-i" strokeWidth={1.75} />{post.category}
            </span>
            <span className="rk-meta-item">
              <Clock className="rk-i" strokeWidth={1.75} />{post.readingMinutes} 分钟
            </span>
            <PostViews />
          </span>
        </div>
        <h1 className="rk-post-title">{post.title}</h1>
        {post.excerpt && <p className="rk-post-lede">{post.excerpt}</p>}
      </header>

      <div className="rk-post-body-wrap">
        <TableOfContents items={post.toc} />

        <article
          className="rk-post-body rk-prose"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </div>

      {post.tags.length > 0 && (
        <div className="rk-post-tags">
          {post.tags.map(t => <span key={t} className="rk-tag">#{t}</span>)}
        </div>
      )}

      {(older || newer) && (
        <nav className="rk-post-nav" aria-label="上下篇导航">
          {older ? (
            <Link href={`/posts/${older.slug}/`} className="rk-post-nav-link">
              <span className="rk-post-nav-label"><ArrowLeft className="rk-i" strokeWidth={1.75} />上一篇</span>
              <span className="rk-post-nav-title">{older.title}</span>
            </Link>
          ) : <span />}
          {newer ? (
            <Link href={`/posts/${newer.slug}/`} className="rk-post-nav-link rk-post-nav-next">
              <span className="rk-post-nav-label">下一篇<ArrowRight className="rk-i" strokeWidth={1.75} /></span>
              <span className="rk-post-nav-title">{newer.title}</span>
            </Link>
          ) : <span />}
        </nav>
      )}

      {related.length > 0 && (
        <section className="rk-related">
          <div className="rk-related-head">相关文章</div>
          <ul className="rk-related-list">
            {related.map(p => (
              <li key={p.slug}>
                <Link href={`/posts/${p.slug}/`} className="rk-related-link">
                  <span className="rk-related-title">{p.title}</span>
                  <span className="rk-related-meta">{formatDate(p.date)} · {p.category}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <PostZoom />
      <CodeBlock />
      <Comments />
    </div>
  );
}
