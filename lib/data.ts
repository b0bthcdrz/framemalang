import { sanityClient } from '@/sanity/lib/client';
import {
  qAllAuthors,
  qAllCategories,
  qAllHashtags,
  qArticleBySlug,
  qArticlesByCategory,
  qArticlesByHashtag,
  qAuthorBySlug,
  qFeaturedArticles,
  qRecentArticles,
  qSiteSettings
} from '@/sanity/lib/queries';
import type { Article, Author, Category, SiteSettings } from './types';

const fallbackCategories: Category[] = [
  { _id: 'c1', title: 'Sosok', slug: { current: 'sosok' }, description: 'Tokoh lokal Malang.' },
  { _id: 'c2', title: 'Heritage', slug: { current: 'heritage' }, description: 'Warisan sejarah dan budaya.' },
  { _id: 'c3', title: 'Event', slug: { current: 'event' }, description: 'Agenda dan kegiatan terbaru.' }
];

const fallbackAuthor: Author = {
  _id: 'a1',
  name: 'Tim Frame Malang',
  slug: { current: 'tim-frame-malang' },
  bio: 'Redaksi lokal untuk cerita Malang.'
};

const fallbackArticles: Article[] = [
  {
    _id: 'art1',
    title: 'Selamat Datang di Frame Malang',
    slug: { current: 'selamat-datang' },
    publishedAt: new Date().toISOString(),
    status: 'published',
    excerpt: 'Portal cerita Malang sedang disiapkan dengan dukungan Sanity + Next.js.',
    hashtags: ['malang', 'launch'],
    featured: true,
    author: fallbackAuthor,
    categories: [fallbackCategories[0]]
  }
];

const fallbackSettings: SiteSettings = {
  siteTitle: 'Frame Malang',
  tagline: 'Cerita Malang, Satu Frame Sekaligus',
  footerText: `© ${new Date().getFullYear()} Frame Malang`
};

async function safeFetch<T>(query: string, params: Record<string, string> = {}, fallback?: T): Promise<T> {
  try {
    return await sanityClient.fetch<T>(query, params, { next: { revalidate: 60 } });
  } catch {
    return fallback as T;
  }
}

export const getFeaturedArticles = () => safeFetch<Article[]>(qFeaturedArticles, {}, fallbackArticles);
export const getRecentArticles = () => safeFetch<Article[]>(qRecentArticles, {}, fallbackArticles);
export const getArticleBySlug = (slug: string) => safeFetch<Article | null>(qArticleBySlug, { slug }, null);
export const getArticlesByCategory = (slug: string) => safeFetch<Article[]>(qArticlesByCategory, { slug }, []);
export const getAuthorWithArticles = (slug: string) => safeFetch<(Author & { articles: Article[] }) | null>(qAuthorBySlug, { slug }, null);
export const getArticlesByHashtag = (slug: string) => safeFetch<Article[]>(qArticlesByHashtag, { slug }, []);
export const getAllCategories = () => safeFetch<Array<Pick<Category, 'title' | 'slug'>>>(qAllCategories, {}, fallbackCategories);
export const getAllAuthors = () => safeFetch<Array<Pick<Author, 'name' | 'slug'>>>(qAllAuthors, {}, [fallbackAuthor]);
export const getAllHashtags = () => safeFetch<string[]>(qAllHashtags, {}, ['malang']);
export const getSiteSettings = () => safeFetch<SiteSettings>(qSiteSettings, {}, fallbackSettings);
