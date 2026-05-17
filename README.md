# rainif.com · fi_niaR

Personal blog of **fi niaR**, rebuilt from the old Hexo + NexT.Pisces static output into a modern **Next.js 16 + React 19** static site.

> write it down, if it rains.

## Stack

- **Next.js 16** App Router, statically exported for GitHub Pages.
- **React 19** + **TypeScript 6**.
- **Markdown posts** in `content/posts/*.md`.
- **gray-matter** for frontmatter, **unified / remark / rehype** for Markdown rendering.
- **Pagefind** for static full-site search.
- **Giscus** for GitHub Discussions comments.
- **RSS 2.0**, `robots.txt`, and `sitemap.xml` generated at build time.
- **Lucide React** icons plus local brand SVG icons for GitHub / YouTube / Instagram.
- **motion** for small navigation and modal transitions.

## Write A Post

Create a Markdown file in `content/posts/<slug>.md`:

```yaml
---
title: 文章标题
date: 2026-05-17
updated: 2026-05-17
category: 项目
tags: [Next.js, TypeScript]
excerpt: 一两句话的摘要，会显示在首页卡片和文章页头部。
slug: my-post
---
```

Then push to `master`. GitHub Actions builds the static site and deploys it to GitHub Pages.

## Images

Post images live under:

```text
public/images/posts/<slug>/
```

Reference them from Markdown with root-relative paths:

```md
![截图说明](/images/posts/<slug>/hero.jpg)
```

Existing examples:

- `public/images/posts/off-work-countdown/`
- `public/images/posts/mihomo-subconverter/`

## Local Development

```bash
npm install
npm run dev
npm run build
```

Notes:

- `npm run build` first runs `scripts/generate-rss.mjs`.
- Next.js writes the static export to `out/`.
- Pagefind writes the search index to `out/_pagefind/`.
- The search modal shows a development notice until the Pagefind index exists.

## Project Layout

```text
app/
  layout.tsx            Root layout, header, footer, theme bootstrap
  page.tsx              Home page
  globals.css           Design tokens, component CSS, responsive rules
  posts/[slug]/         Article page and TOC
  archive/              Year-grouped archive
  tags/                 Tag cloud and category cards
  bio/                  Bio page
  robots.ts             robots.txt route
  sitemap.ts            sitemap.xml route
  not-found.tsx         404 page

components/
  Header.tsx            Sticky nav, theme toggle, platform-aware search shortcut
  SearchModal.tsx       Pagefind-backed search overlay
  PostCard.tsx          Home/archive card component
  Comments.tsx          Giscus comments
  Footer.tsx            Site footer
  icons/                Local brand icons

content/posts/          Markdown source posts
lib/posts.ts            Frontmatter + Markdown pipeline
scripts/generate-rss.mjs
public/                 Static assets, CNAME, avatars, post images
.github/workflows/      GitHub Pages deploy workflow
```

## Search Shortcut

The search button supports both:

- macOS / iOS / iPadOS: `⌘K`
- Windows / Linux: `Ctrl K`

The label is chosen client-side from the current platform. The keyboard handler accepts both `Meta+K` and `Ctrl+K`.

## Deployment

Deployment is handled by `.github/workflows/deploy.yml`:

1. Checkout repository.
2. Install dependencies with `npm ci`.
3. Run `npm run build`.
4. Add `out/.nojekyll`.
5. Upload `out/` to GitHub Pages.

GitHub Pages must use **Settings → Pages → Source → GitHub Actions**.

## Design Notes

The visual system is based on the Claude Design handoff for rainif:

- Charcoal-on-paper editorial base.
- Deep indigo accent (`#3730A3`).
- Manrope, Instrument Serif, JetBrains Mono, and Noto Sans SC from `fonts.loli.net`.
- Light/dark theme via `[data-theme]` and localStorage.
- Desktop article layout uses a fixed TOC column; long links are wrapped so content cannot push the TOC off-screen.
- Mobile layout uses a two-row header, compact navigation, full-width CTA buttons, and tighter bottom spacing.

## Comments

Comments use Giscus with:

- Repository: `ififi2017/ififi2017.github.io`
- Category: `Comments`
- Mapping: `pathname`
- Reactions: disabled
- Lazy loading: enabled

The `Comments` category should remain an Announcement-type GitHub Discussions category so only maintainers and Giscus create new discussions, while visitors can comment after GitHub login.

## Source Attribution

- Original site: <https://rainif.com>
- Repository: <https://github.com/ififi2017/ififi2017.github.io>
- Off Work Countdown: <https://github.com/ififi2017/Off-Work-Countdown>
- Mihomo Subconverter: <https://github.com/ififi2017/mihomo-subconverter>
