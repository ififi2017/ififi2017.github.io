// Build-time RSS 2.0 generator. Reads content/posts/*.md, writes public/rss.xml
// so Next.js copies it to out/rss.xml during static export.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

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

// Full-content rendering for <content:encoded>. No syntax highlighting here —
// feed readers style code themselves; keep the feed lean.
const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeStringify, { allowDangerousHtml: true });

// Same Obsidian-path rewrite as lib/posts.ts, but straight to absolute URLs
// so images resolve inside feed readers; then absolutize any remaining
// root-relative src/href.
const renderFullHtml = async markdown => {
  const rewritten = markdown
    .replace(/(!\[[^\]]*\]\()\.\.\/\.\.\/public\//g, `$1${SITE}/`)
    .replace(/(<img[^>]+src=["'])\.\.\/\.\.\/public\//g, `$1${SITE}/`);
  const html = String(await markdownProcessor.process(rewritten));
  return html.replace(/(src|href)=(["'])\//g, `$1=$2${SITE}/`);
};

// "]]>" inside content would terminate the CDATA section early.
const cdata = s => `<![CDATA[${String(s).replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;

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
        content,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
};

const renderItem = async post => `
    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${SITE}/posts/${encodeURIComponent(post.slug)}/</link>
      <guid isPermaLink="true">${SITE}/posts/${encodeURIComponent(post.slug)}/</guid>
      <pubDate>${toRfc822(post.date)}</pubDate>
      ${post.category ? `<category>${xmlEscape(post.category)}</category>` : ''}
      <author>${xmlEscape(AUTHOR_EMAIL)} (${xmlEscape(AUTHOR_NAME)})</author>
      <description>${cdata(post.excerpt)}</description>
      <content:encoded>${cdata(await renderFullHtml(post.content))}</content:encoded>
    </item>`;

const posts = readPosts();
const lastBuildDate = posts[0]?.updated || new Date().toISOString();
const items = (await Promise.all(posts.map(renderItem))).join('');

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${xmlEscape(TITLE)}</title>
    <link>${SITE}/</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${xmlEscape(DESCRIPTION)}</description>
    <language>${LANG}</language>
    <lastBuildDate>${toRfc822(lastBuildDate)}</lastBuildDate>
    <generator>rainif-blog (Next.js)</generator>${items}
  </channel>
</rss>
`;

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, feed, 'utf8');
console.log(`✓ RSS feed written to public/rss.xml (${posts.length} items, full content)`);
