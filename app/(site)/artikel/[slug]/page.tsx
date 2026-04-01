import ArticleBody from '@/components/article/ArticleBody';
import ArticleMeta from '@/components/article/ArticleMeta';
import Container from '@/components/layout/Container';
import ArticleJsonLd from '@/components/seo/ArticleJsonLd';
import { getAllHashtags, getArticleBySlug } from '@/lib/data';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const hashtags = await getAllHashtags();
  return hashtags.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return { title: article.seo?.metaTitle ?? article.title, description: article.seo?.metaDescription ?? article.excerpt };
}

export default async function ArtikelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <Container className="space-y-5 py-10">
      <ArticleJsonLd article={article} />
      <h1 className="text-4xl font-bold">{article.title}</h1>
      <ArticleMeta article={article} />
      <ArticleBody value={article.body} />
      <div className="flex flex-wrap gap-2">
        {article.hashtags?.map((tag) => (
          <Link key={tag} href={`/hashtag/${tag}`} className="rounded bg-slate-100 px-2 py-1 text-sm">
            #{tag}
          </Link>
        ))}
      </div>
    </Container>
  );
}
