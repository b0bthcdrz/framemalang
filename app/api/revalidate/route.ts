import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');
  if (!secret || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const type = body?._type;
  const slug = body?.slug?.current || body?.slug;

  revalidateTag('homepage');
  revalidateTag('articles');

  if (type === 'article' && slug) revalidateTag(`article:${slug}`);
  if (type === 'category' && slug) revalidateTag(`category:${slug}`);
  if (type === 'author' && slug) revalidateTag(`author:${slug}`);

  return NextResponse.json({ ok: true, revalidated: { type, slug } });
}
