import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';

const SITE_URL = 'https://rainif.com';

export const dynamic = 'force-static';

const staticRoutes = [
  { path: '/', priority: 1 },
  { path: '/archive/', priority: 0.8 },
  { path: '/tags/', priority: 0.7 },
  { path: '/bio/', priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const latestPost = posts[0];
  const latestChange = latestPost
    ? new Date(latestPost.updated ?? latestPost.date)
    : new Date('2026-05-17');

  return [
    ...staticRoutes.map(route => ({
      url: `${SITE_URL}${route.path}`,
      lastModified: latestChange,
      changeFrequency: 'weekly' as const,
      priority: route.priority,
    })),
    ...posts.map(post => ({
      url: `${SITE_URL}/posts/${post.slug}/`,
      lastModified: new Date(post.updated ?? post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
  ];
}
