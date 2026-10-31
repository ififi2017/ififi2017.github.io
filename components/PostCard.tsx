import Link from 'next/link';
import type { PostMeta } from '@/lib/posts';

// A journal entry: the date sits in the margin like a diary page,
// the title and excerpt read in the middle, the cover is a small print on the right.
export default function PostCard({ post }: { post: PostMeta }) {
  const [year, month, day] = post.date.split('-');

  return (
    <article className={`rk-entry${post.coverImage ? ' has-cover' : ''}`}>
      <Link href={`/posts/${post.slug}/`} className="rk-entry-link">
        <time className="rk-entry-date" dateTime={post.date}>
          <span className="rk-entry-day">{month}.{day}</span>
          <span className="rk-entry-year">{year}</span>
        </time>

        <div className="rk-entry-body">
          <p className="rk-entry-meta">
            <span className="rk-entry-category">{post.category}</span>
            <span>{post.readingMinutes} 分钟阅读</span>
          </p>
          <h3 className="rk-entry-title">{post.title}</h3>
          {post.excerpt && <p className="rk-entry-excerpt">{post.excerpt}</p>}
        </div>

        {post.coverImage && (
          <div className="rk-entry-cover" aria-hidden="true">
            {/* Plain <img> rather than next/image: the source is already
                static-exported, so the build doesn't need the optimization path. */}
            <img src={post.coverImage} alt="" loading="lazy" decoding="async" />
          </div>
        )}
      </Link>
    </article>
  );
}
