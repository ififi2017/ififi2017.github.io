import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { PostMeta } from '@/lib/posts';

const formatDate = (d: string) => d.replace(/-/g, '.');

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className={`rk-card${post.coverImage ? ' has-cover' : ''}`}>
      <Link href={`/posts/${post.slug}/`} className="rk-card-link" aria-label={post.title}>
        <div className="rk-card-body">
          <div className="rk-card-meta">
            <span className="rk-card-category">{post.category}</span>
            <span>{formatDate(post.date)}</span>
            <span>{post.readingMinutes} min read</span>
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
              阅读 <ArrowUpRight className="rk-i" strokeWidth={1.75} />
            </span>
          </div>
        </div>

        {post.coverImage && (
          <div className="rk-card-cover" aria-hidden="true">
            {/* Plain <img> rather than next/image: the source is already
                static-exported, so the build doesn't need the optimization path. */}
            <img src={post.coverImage} alt="" loading="lazy" decoding="async" />
          </div>
        )}
      </Link>
    </article>
  );
}
