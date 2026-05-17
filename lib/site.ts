import fs from 'node:fs';
import path from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

const SITE_DIR = path.join(process.cwd(), 'content', 'site');

export type ProfileLink = {
  type: 'email' | 'github' | 'youtube' | 'instagram' | 'rss';
  label: string;
  href: string;
};

export type Profile = {
  name: string;
  handle: string;
  avatar: string;
  lede: string[];
  now: string[];
  links: ProfileLink[];
  site: string[];
  version: string;
  license: string;
};

const renderInlineMarkdown = async (markdown: string): Promise<string> => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);

  return String(file)
    .replace(/^<p>/, '')
    .replace(/<\/p>\n?$/, '');
};

export const getProfile = (): Profile => {
  const raw = fs.readFileSync(path.join(SITE_DIR, 'profile.json'), 'utf8');
  return JSON.parse(raw) as Profile;
};

export const getBioHtml = async (): Promise<string> => {
  const raw = fs.readFileSync(path.join(SITE_DIR, 'bio.md'), 'utf8');
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(raw);
  return String(file);
};

export const getInlineMarkdownHtml = renderInlineMarkdown;
