import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, CalendarCheck, Folder, Clock } from 'lucide-react';
import TableOfContents from './toc';
import Comments from '@/components/Comments';
import { getAllPosts, getPost } from '@/lib/posts';

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const post = await getPost(params.slug);
  if (!post) return { title: '未找到' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: 'article' },
  };
}

const formatDate = (d: string) => d.replace(/-/g, ' · ');

export default async function PostPage({ params }: { params: Params }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <div className="rk-screen rk-post">
      <Link href="/" className="rk-back">
        <ArrowLeft className="rk-i" strokeWidth={1.75} /> 返回
      </Link>

      <header className="rk-post-header">
        <div className="rk-post-meta">
          <span className="rk-meta-item">
            <Calendar className="rk-i" strokeWidth={1.75} />{formatDate(post.date)}
          </span>
          {post.updated && (
            <span className="rk-meta-item">
              <CalendarCheck className="rk-i" strokeWidth={1.75} />UPDATED {formatDate(post.updated)}
            </span>
          )}
          <span className="rk-meta-item">
            <Folder className="rk-i" strokeWidth={1.75} />{post.category}
          </span>
          <span className="rk-meta-item">
            <Clock className="rk-i" strokeWidth={1.75} />{post.readingMinutes} MIN
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

      <Comments />
    </div>
  );
}
