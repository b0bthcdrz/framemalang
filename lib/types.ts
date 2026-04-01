export type Slug = { current: string };

export type ImageWithAlt = {
  asset?: { _ref?: string; url?: string };
  alt?: string;
};

export type Category = {
  _id: string;
  title: string;
  slug: Slug;
  description?: string;
};

export type Author = {
  _id: string;
  name: string;
  slug: Slug;
  photo?: ImageWithAlt;
  bio?: string;
  social?: Array<{ platform: string; url: string }>;
};

export type Seo = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: ImageWithAlt;
  noIndex?: boolean;
};

export type Article = {
  _id: string;
  title: string;
  slug: Slug;
  publishedAt: string;
  status: 'draft' | 'published' | 'archived';
  excerpt: string;
  mainImage?: ImageWithAlt;
  body?: unknown[];
  hashtags?: string[];
  featured?: boolean;
  author?: Author;
  categories?: Category[];
  seo?: Seo;
};

export type SiteSettings = {
  siteTitle: string;
  tagline?: string;
  logo?: ImageWithAlt;
  defaultOGImage?: ImageWithAlt;
  socialLinks?: Array<{ platform: string; url: string }>;
  footerText?: string;
};
