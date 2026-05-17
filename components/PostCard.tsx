import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { PostMeta } from '@/lib/posts';

const formatDate = (d: string) => d.replace(/-/g, ' · ');

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="rk-card">
      <Link href={`/posts/${post.slug}/`} className="rk-card-link" aria-label={post.title}>
        <div className="rk-card-meta">
          <span>{formatDate(post.date)}</span>
          {post.updated && (
            <>
              <span className="rk-dot">·</span>
              <span>UPDATED {formatDate(post.updated)}</span>
            </>
          )}
          <span className="rk-dot">·</span>
          <span>{post.readingMinutes} MIN</span>
        </div>

        <h2 className="rk-card-title">
          <span className="rk-card-title-link">{post.title}</span>
        </h2>

        {post.excerpt && <p className="rk-card-excerpt">{post.excerpt}</p>}

        <div className="rk-card-foot">
          <div className="rk-card-tags">
            {post.tags.map(t => <span key={t} className="rk-tag">#{t}</span>)}
          </div>
          <span className="rk-card-arrow">
            阅读 <ArrowRight className="rk-i" strokeWidth={1.75} />
          </span>
        </div>
      </Link>
    </article>
  );
}
