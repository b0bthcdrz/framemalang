# framemalang.com — Implementation Plan

> **Version:** 1.0.0 | **Status:** Approved | **Owner:** Bob
> **Constitution Ref:** CONSTITUTION.md v1.0.0
> **Spec Ref:** SPEC.md v1.0.0
> **Created:** 2025-03-31 | **Last Updated:** 2025-03-31

---

## Technical Context

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| Language | TypeScript (strict mode) | Type safety across CMS queries, component props, and API routes |
| Framework | Next.js 14+ (App Router) | ISR + Server Components + built-in sitemap/robots |
| CMS | Sanity v3 (SaaS) | Free tier, GROQ API, embedded Studio, no cold starts |
| CMS UI | Sanity Studio v3 (embedded at `/studio`) | Single deployment, no separate infra |
| Styling | Tailwind CSS v3 | Utility-first, fast iteration, responsive-first |
| Package Manager | pnpm | Faster installs, strict dependency resolution |
| Hosting | Vercel Free | Edge CDN, ISR, 100 GB BW, 6000 build min |
| Image CDN | Sanity Image Pipeline | URL-based transforms, keeps Vercel BW low |
| Analytics | Vercel Analytics (free) | Passive web vitals + page views, no custom dashboard |
| Search | Sanity native / Pagefind (v2) | Static-compatible; full search UI deferred |
| Testing | Manual at v1; add Vitest later | Speed to launch; formal tests in v2 |

---

## Architecture

```
Editor (Sanity Studio at /studio)
    |
    v
Sanity Cloud (GROQ API + Asset CDN)
    |
    +-- On Publish: Webhook --> POST /api/revalidate
    |
    v
Next.js App Router on Vercel (ISR)
    +-- Tag-based on-demand revalidation
    +-- Static pages served from Vercel Edge CDN
    +-- /studio route (embedded Sanity Studio)
```

### Key Principles

- **Decoupled** — CMS and frontend are independent; content changes never trigger builds
- **ISR over SSR** — pages are static by default, revalidated on publish
- **No build per content change** — on-demand revalidation via webhook only
- **Assets on Sanity CDN** — never store media in Vercel `/public`

---

## Repository Structure

```
framemalang/
├── app/                            # Next.js App Router
│   ├── (site)/                     # Public site layout group
│   │   ├── layout.tsx              # Root site layout (nav, footer)
│   │   ├── page.tsx                # Homepage
│   │   ├── artikel/
│   │   │   ├── page.tsx            # Article listing (all articles)
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Article detail (ISR)
│   │   ├── kategori/
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Category listing (ISR)
│   │   ├── penulis/
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Author profile (ISR)
│   │   └── hashtag/
│   │       └── [slug]/
│   │           └── page.tsx        # Hashtag listing (ISR)
│   ├── api/
│   │   └── revalidate/
│   │       └── route.ts            # Webhook handler for ISR revalidation
│   ├── sitemap.ts                  # Dynamic sitemap generation
│   ├── robots.ts                   # Robots.txt generation
│   └── studio/
│       └── [[...index]]/
│           └── page.tsx            # Embedded Sanity Studio
│
├── components/
│   ├── article/
│   │   ├── ArticleCard.tsx         # Card component for article lists
│   │   ├── ArticleBody.tsx         # Portable Text renderer
│   │   ├── ArticleMeta.tsx         # Author, date, categories display
│   │   └── FeaturedSection.tsx     # Homepage featured articles block
│   ├── layout/
│   │   ├── Header.tsx              # Site header with navigation
│   │   ├── Footer.tsx              # Site footer with info & links
│   │   └── Container.tsx           # Max-width content wrapper
│   ├── seo/
│   │   ├── ArticleJsonLd.tsx       # Article structured data
│   │   ├── BreadcrumbJsonLd.tsx    # BreadcrumbList structured data
│   │   └── PersonJsonLd.tsx        # Person structured data
│   └── ui/                         # Shared primitives (Button, Badge, etc.)
│
├── sanity/
│   ├── schema/
│   │   ├── index.ts                # Schema registry
│   │   ├── documents/
│   │   │   ├── article.ts          # Article document type
│   │   │   ├── author.ts           # Author document type
│   │   │   ├── category.ts         # Category document type
│   │   │   └── siteSettings.ts     # Global settings singleton
│   │   └── objects/
│   │       ├── seo.ts              # Reusable SEO fields object
│   │       └── imageWithAlt.ts     # Image + alt text object
│   ├── lib/
│   │   ├── client.ts               # Sanity client config
│   │   ├── image.ts                # Image URL builder
│   │   └── queries.ts              # All GROQ queries
│   └── sanity.config.ts            # Studio config
│
├── lib/
│   ├── types.ts                    # Shared TypeScript types
│   └── utils.ts                    # Helpers (slugify, date format, etc.)
│
├── public/                         # Static assets (favicons, OG fallback only)
│
├── .env.local                      # Local env vars (gitignored)
├── .env.example                    # Env var template (committed)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── sanity.cli.ts
└── package.json
```

---

## Dependencies

### Production

| Package | Purpose |
|---------|---------|
| `next` | Framework (App Router, ISR) |
| `react`, `react-dom` | UI library |
| `sanity` | Sanity client |
| `@sanity/vision` | Sanity Studio visual editing |
| `next-sanity` | Next.js + Sanity integration helpers |
| `@sanity/image-url` | Image URL builder |
| `@portabletext/react` | Portable Text renderer |
| `date-fns` | Date formatting (Indonesian locale) |

### Development

| Package | Purpose |
|---------|---------|
| `tailwindcss`, `postcss`, `autoprefixer` | Styling |
| `typescript`, `@types/react`, `@types/node` | Type checking |
| `eslint`, `eslint-config-next` | Linting |
| `@vercel/analytics` | Vercel Analytics (free) |

---

## Sanity Schema Design

### Document: article

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | string | Yes | Display title |
| slug | slug (from title) | Yes | URL identifier |
| publishedAt | datetime | Yes | Publication date |
| status | string (enum) | Yes | `draft`, `published`, `archived` |
| author | reference → author | Yes | Single author |
| categories | array → reference category | No | Multi-select from sosok/heritage/event |
| hashtags | array of string | No | Free-form tags (displayed as #hashtag) |
| mainImage | imageWithAlt | Yes | Hero image |
| excerpt | text (180 chars) | Yes | For cards + OG |
| body | Portable Text (block) | Yes | Rich body content |
| seo | seo object | No | Override meta title/desc |
| featured | boolean | No | For homepage featured block |

### Document: author

| Field | Type | Required |
|-------|------|----------|
| name | string | Yes |
| slug | slug | Yes |
| photo | imageWithAlt | No |
| bio | text | No |
| social | array of { platform, url } | No |

### Document: category

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | string | Yes | Display name |
| slug | slug | Yes | URL identifier |
| description | text | No | Category description |

**Fixed categories at launch:** `sosok`, `heritage`, `event`

### Singleton: siteSettings

| Field | Type | Notes |
|-------|------|-------|
| siteTitle | string | e.g., "Frame Malang" |
| tagline | string | e.g., "Cerita Malang, Satu Frame Sekaligus" |
| logo | image | Site logo |
| defaultOGImage | image | Fallback OG image |
| socialLinks | array | Platform + URL pairs |
| footerText | text | Footer copyright/attribution |

### Object: seo

| Field | Type | Notes |
|-------|------|-------|
| metaTitle | string | Override for `<title>` |
| metaDescription | text | Override for meta description |
| ogImage | image | Override OG image |
| noIndex | boolean | Block crawlers |

### Object: imageWithAlt

| Field | Type | Notes |
|-------|------|-------|
| image | image | Sanity image reference |
| alt | string | Alt text for accessibility |

---

## GROQ Queries

All queries live in `sanity/lib/queries.ts`.

### Q1: Featured Articles (Homepage)

```groq
*[_type == "article" && status == "published" && featured == true]
  | order(publishedAt desc)[0...5] {
    _id, title, slug, publishedAt, excerpt, mainImage,
    "author": author->{ name, slug, photo }
  }
```

### Q2: Recent Articles (Homepage + Article Listing)

```groq
*[_type == "article" && status == "published"]
  | order(publishedAt desc)
  [$start...$end] {
    _id, title, slug, publishedAt, excerpt, mainImage,
    "author": author->{ name, slug, photo },
    "categories": categories[]->{ title, slug }
  }
```

### Q3: Article Detail (by slug)

```groq
*[_type == "article" && slug.current == $slug && status == "published"][0] {
  _id, title, slug, publishedAt, body, mainImage, hashtags, seo,
  "author": author->{ name, slug, photo, bio },
  "categories": categories[]->{ title, slug }
}
```

### Q4: Articles by Category

```groq
*[_type == "article" && status == "published"
  && $slug in categories[]->slug.current]
  | order(publishedAt desc) {
    _id, title, slug, publishedAt, excerpt, mainImage,
    "author": author->{ name, slug }
  }
```

### Q5: Articles by Author

```groq
*[_type == "article" && status == "published"
  && $slug in author->slug.current]
  | order(publishedAt desc) {
    _id, title, slug, publishedAt, excerpt, mainImage,
    "categories": categories[]->{ title, slug }
  }
```

### Q6: Articles by Hashtag

```groq
*[_type == "article" && status == "published"
  && $tag in hashtags]
  | order(publishedAt desc) {
    _id, title, slug, publishedAt, excerpt, mainImage,
    "author": author->{ name, slug }
  }
```

### Q7: All Categories

```groq
*[_type == "category"] {
  _id, title, slug, description
} | order(title asc)
```

### Q8: All Hashtags (distinct)

```groq
array::distinct(*[_type == "article" && status == "published"].hashtags[])
```

### Q9: Site Settings

```groq
*[_type == "siteSettings"][0] {
  siteTitle, tagline, logo, defaultOGImage, socialLinks, footerText
}
```

---

## ISR Revalidation Strategy

### Tag Naming Convention

| Content Type | ISR Tag |
|-------------|---------|
| All articles | `articles` |
| Single article | `article:{slug}` |
| Category page | `category:{slug}` |
| Author page | `author:{slug}` |
| Hashtag page | `hashtag:{slug}` |
| Homepage | `homepage` |
| Site settings | `settings` |

### Fetch Usage in Page Components

```typescript
// app/(site)/artikel/[slug]/page.tsx
const article = await sanityClient.fetch(articleBySlugQuery, { slug }, {
  next: { tags: [`article:${slug}`, 'articles'] }
})
```

### Revalidation API Route

```typescript
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-webhook-secret')
  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { _type, slug } = body

  switch (_type) {
    case 'article':
      revalidateTag(`article:${slug?.current}`)
      revalidateTag('articles')
      revalidateTag('homepage')
      // Also revalidate category and hashtag pages that may contain this article
      break
    case 'category':
      revalidateTag(`category:${slug?.current}`)
      break
    case 'author':
      revalidateTag(`author:${slug?.current}`)
      break
    case 'siteSettings':
      revalidateTag('settings')
      revalidateTag('homepage')
      break
  }

  return Response.json({ revalidated: true, at: new Date().toISOString() })
}
```

### Sanity Webhook Configuration

| Setting | Value |
|---------|-------|
| URL | `https://framemalang.com/api/revalidate` |
| Trigger | On create + on publish + on unpublish |
| HTTP Method | POST |
| Secret Header | `x-webhook-secret: <SANITY_WEBHOOK_SECRET>` |
| Projection | `{ _type, "slug": slug }` |

---

## Environment Variables

```env
# .env.example

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_READ_TOKEN=
SANITY_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_SITE_URL=https://framemalang.com
```

---

## Next.js Configuration

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
}

export default config
```

---

## SEO Implementation

### Per-Page Metadata
- Every page exports `generateMetadata()` from Next.js
- Article pages: article SEO object fields > title/excerpt fallback > siteSettings defaults
- Category/hashtag pages: category name + description
- Author pages: author name + bio
- Canonical URLs always set

### Structured Data
- Article JSON-LD on article detail pages
- BreadcrumbList JSON-LD on category and hashtag pages
- Person JSON-LD on author profile pages

### Sitemap & Robots
- `app/sitemap.ts` — dynamic sitemap from all published articles, categories, authors
- `app/robots.ts` — blocks `/studio`, `/api/`; allows everything else

---

## Vercel Free Tier Budget

| Resource | Free Limit | Estimated Usage | Margin |
|----------|-----------|-----------------|--------|
| Bandwidth | 100 GB/mo | ~10-20 GB (images via Sanity CDN) | 80-90% headroom |
| Build Minutes | 6,000 min/mo | ~5-10 min per deploy, ~10 deploys/mo = ~100 min | 98% headroom |
| Serverless Invocations | 100k/mo | Only `/api/revalidate` (few dozen/mo) | 99.9% headroom |
| Edge Requests | Unlimited | All static page requests | No concern |
| Deployments | 100/day | ~5-10 code deploys/mo | No concern |

---

## Complexity Assessment

| Component | Complexity | Notes |
|-----------|-----------|-------|
| Sanity schema + Studio | Medium | 4 document types, 2 objects, singleton |
| GROQ queries | Medium | 9 queries, some with joins |
| ISR revalidation | Medium | Tag-based, webhook handler |
| Page components | Medium | 7 route pages with generateStaticParams + generateMetadata |
| Layout components | Low | Header, footer, container |
| SEO layer | Medium | JSON-LD, sitemap, robots, metadata |
| Styling | Medium | Tailwind responsive, mobile-first |
| Deployment | Low | Vercel free, git push to deploy |
