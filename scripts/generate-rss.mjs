// Build-time RSS 2.0 generator. Reads content/posts/*.md, writes public/rss.xml
// so Next.js copies it to out/rss.xml during static export.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'content', 'posts');
const OUT_FILE = path.join(ROOT, 'public', 'rss.xml');

const SITE = 'https://rainif.com';
const TITLE = 'fi_niaR';
const DESCRIPTION = '代码 · 视频 · 摄影 · 折腾。写下来才算数。';
const LANG = 'zh-CN';
const AUTHOR_EMAIL = 'if@rainif.com';
const AUTHOR_NAME = 'fi niaR';

const xmlEscape = s =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const toRfc822 = isoDate => {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return new Date().toUTCString();
  return d.toUTCString();
};

const slugFromFilename = file => file.replace(/\.md$/i, '');

const toIsoDate = val => {
  if (val instanceof Date) return val.toISOString().slice(0, 10);
  if (typeof val === 'string') return val.slice(0, 10);
  return '';
};

const readPosts = () => {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(file => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
      const { data, content } = matter(raw);
      const slug = (data.slug || slugFromFilename(file)).toString();
      const date = toIsoDate(data.date);
      return {
        slug,
        title: String(data.title || slug),
        date,
        updated: data.updated ? toIsoDate(data.updated) : date,
        category: String(data.category || ''),
        excerpt: String(data.excerpt || content.slice(0, 280)),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
};

const renderItem = post => `
    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${SITE}/posts/${encodeURIComponent(post.slug)}/</link>
      <guid isPermaLink="true">${SITE}/posts/${encodeURIComponent(post.slug)}/</guid>
      <pubDate>${toRfc822(post.date)}</pubDate>
      ${post.category ? `<category>${xmlEscape(post.category)}</category>` : ''}
      <author>${xmlEscape(AUTHOR_EMAIL)} (${xmlEscape(AUTHOR_NAME)})</author>
      <description><![CDATA[${post.excerpt}]]></description>
    </item>`;

const posts = readPosts();
const lastBuildDate = posts[0]?.updated || new Date().toISOString();

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(TITLE)}</title>
    <link>${SITE}/</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${xmlEscape(DESCRIPTION)}</description>
    <language>${LANG}</language>
    <lastBuildDate>${toRfc822(lastBuildDate)}</lastBuildDate>
    <generator>rainif-blog (Next.js)</generator>${posts.map(renderItem).join('')}
  </channel>
</rss>
`;

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, feed, 'utf8');
console.log(`✓ RSS feed written to public/rss.xml (${posts.length} items)`);
