import { getAllAuthors, getAllCategories, getAllHashtags, getRecentArticles } from '@/lib/data';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const [articles, categories, authors, hashtags] = await Promise.all([
    getRecentArticles(),
    getAllCategories(),
    getAllAuthors(),
    getAllHashtags()
  ]);

  return [
    { url: `${siteUrl}/` },
    { url: `${siteUrl}/artikel` },
    ...articles.map((a) => ({ url: `${siteUrl}/artikel/${a.slug.current}` })),
    ...categories.map((c) => ({ url: `${siteUrl}/kategori/${c.slug.current}` })),
    ...authors.map((a) => ({ url: `${siteUrl}/penulis/${a.slug.current}` })),
    ...hashtags.map((h) => ({ url: `${siteUrl}/hashtag/${h}` }))
  ];
}
