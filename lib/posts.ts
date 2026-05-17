import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  category: string;
  tags: string[];
  excerpt: string;
  readingMinutes: number;
};

export type Post = PostMeta & {
  html: string;
  toc: TocItem[];
};

export type TocItem = { id: string; text: string; level: number };

const slugFromFilename = (file: string) => file.replace(/\.md$/i, '');

const toIsoDate = (val: unknown): string => {
  if (val instanceof Date) return val.toISOString().slice(0, 10);
  if (typeof val === 'string') return val.slice(0, 10);
  return '';
};

const readingMinutes = (markdown: string) => {
  const cjk = (markdown.match(/[一-鿿]/g) ?? []).length;
  const words = (markdown.replace(/[一-鿿]/g, '').match(/\S+/g) ?? []).length;
  return Math.max(1, Math.round(cjk / 350 + words / 220));
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\w一-鿿\- ]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const extractToc = (markdown: string): TocItem[] => {
  const lines = markdown.split('\n');
  const toc: TocItem[] = [];
  let inFence = false;
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^```/.test(line.trim())) { inFence = !inFence; continue; }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+)$/.exec(line);
    if (!m) continue;
    const level = m[1].length;
    const text = m[2].replace(/`/g, '').trim();
    toc.push({ id: slugify(text), text, level });
  }
  return toc;
};

const renderMarkdown = async (markdown: string): Promise<string> => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);
  return String(file);
};

let cache: PostMeta[] | null = null;

export const getAllPosts = (): PostMeta[] => {
  if (cache) return cache;
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  const posts = files.map(file => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    const { data, content } = matter(raw);
    const slug = (data.slug as string | undefined) ?? slugFromFilename(file);
    return {
      slug,
      title: String(data.title ?? slug),
      date: toIsoDate(data.date),
      updated: data.updated ? toIsoDate(data.updated) : undefined,
      category: String(data.category ?? '未分类'),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      excerpt: String(data.excerpt ?? ''),
      readingMinutes: readingMinutes(content),
    } satisfies PostMeta;
  });
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  cache = posts;
  return posts;
};

export const getPost = async (slug: string): Promise<Post | null> => {
  const meta = getAllPosts().find(p => p.slug === slug);
  if (!meta) return null;
  const file = fs.readdirSync(POSTS_DIR).find(f => {
    const r = fs.readFileSync(path.join(POSTS_DIR, f), 'utf8');
    const fm = matter(r).data;
    const s = (fm.slug as string | undefined) ?? slugFromFilename(f);
    return s === slug;
  });
  if (!file) return null;
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
  const { content } = matter(raw);
  const html = await renderMarkdown(content);
  const toc = extractToc(content);
  return { ...meta, html, toc };
};

export const getPostsByYear = (): { year: number; posts: PostMeta[] }[] => {
  const groups = new Map<number, PostMeta[]>();
  for (const p of getAllPosts()) {
    const year = Number(p.date.slice(0, 4));
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year)!.push(p);
  }
  return [...groups.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, posts]) => ({ year, posts }));
};

export const getAllTags = (): { name: string; count: number }[] => {
  const counts = new Map<string, number>();
  for (const p of getAllPosts()) {
    for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, count }));
};

export const getAllCategories = (): { name: string; count: number }[] => {
  const counts = new Map<string, number>();
  for (const p of getAllPosts()) {
    counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, count }));
};
