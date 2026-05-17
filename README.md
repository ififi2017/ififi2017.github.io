# rainif.com · fi_niaR

Personal blog of **fi niaR**, modernized from Hexo + NexT.Pisces to **Next.js 14** + statically exported to GitHub Pages.

> a quiet corner for code & rain.

## Stack

- **Next.js 14** (App Router, static export via `output: 'export'`)
- **React 18** + **TypeScript**
- **Markdown** posts in `content/posts/*.md` — `gray-matter` for frontmatter, `unified`/`remark`/`rehype` for HTML rendering
- **Lucide** icons (MIT-licensed line set)
- Design tokens lifted from the [rainif Design System](#design-system) handoff bundle

## Workflow

Write a new post by dropping a Markdown file into `content/posts/<slug>.md` with this frontmatter:

```yaml
---
title: 文章标题
date: 2026-05-17
updated: 2026-05-17        # optional
category: macOS            # primary category for archive listing
tags: [macOS, OpenCore]    # YAML list
excerpt: 一两句话的摘要。     # shown on home + post header
slug: my-post              # optional; defaults to filename
---
```

Then `git push`. The `Deploy to GitHub Pages` workflow builds the static site and publishes it.

Local development:

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export to ./out
```

## Project layout

```
app/                    Next.js App Router routes
  layout.tsx            Root layout (header, footer, theme bootstrap)
  page.tsx              Home (hero + recent posts)
  globals.css           Design tokens + kit styles
  posts/[slug]/         Article view with TOC sidebar
  archive/              Year-grouped chronological list
  tags/                 Tag cloud + category grid
  bio/                  About page
  not-found.tsx         404
components/             Header, Footer, PostCard
content/posts/          Markdown source — push here to publish
lib/posts.ts            Frontmatter + Markdown → HTML pipeline
public/                 Static assets (favicons, CNAME, ads.txt, avatar)
.github/workflows/      GitHub Pages deploy on push to master
.legacy/                Old Hexo build output, kept for reference
```

## Design system

The visual language comes from the **rainif Design System** handoff bundle:

- Charcoal-on-paper palette, warm coral accent (`#FC6423`) preserved from NexT.Pisces.
- Manrope + Instrument Serif italic + JetBrains Mono + Noto Sans SC.
- 4px spacing base, sharp radii, one easing curve.
- Light + dark via `[data-theme]` (and `prefers-color-scheme` fallback).

See `app/globals.css` for the full token list and `.rk-*` component classes.

## Caveats

- `public/avatar.gif` is the original placeholder silhouette. Replace with a real portrait at `public/avatar.{jpg,png}` (and update `BioScreen`) when ready.
- The ⌘K search button is decorative — no search index wired yet.
- RSS link in the header/footer points at `/rss.xml` but no feed generator is wired.
- Comments aren't wired. `giscus` (GitHub-Discussions-backed) is the suggested addition.
- Fonts load from Google Fonts CDN. For offline/China-region performance, self-host Noto Sans SC subsets.
- Live2D ("waifu") widget from the original site is deliberately dropped.

## Source attribution

- Original site: <https://rainif.com>
- Hexo source repo: <https://github.com/ififi2017/ififi2017.github.io>
- Design system: see `chat1.md` reference in the handoff bundle
