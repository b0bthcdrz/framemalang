import type { Article } from '@/lib/types';

export default function ArticleJsonLd({ article }: { article: Article }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    datePublished: article.publishedAt,
    author: article.author?.name
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
