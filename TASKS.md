# framemalang.com — Task List

> **Version:** 1.0.0 | **Status:** Active | **Owner:** Bob
> **Constitution Ref:** CONSTITUTION.md v1.0.0
> **Spec Ref:** SPEC.md v1.0.0
> **Plan Ref:** PLAN.md v1.0.0
> **Created:** 2025-03-31 | **Last Updated:** 2025-03-31

---

## Implementation Strategy: Milestone-Based

Tasks are organized into 7 milestones matching the spec milestones. Each milestone is a coherent unit of work that produces a verifiable deliverable. Tasks within a milestone are sequential unless marked with `[P]` for parallel execution.

**Execution order:** M1 → M2 → M3 → M4 → M5 → M6 → M7

---

## Phase 1: Foundation (M1 + M2)

### Milestone 1 — Project Scaffold

**Goal:** Repo initialized with Next.js + Sanity + env config. `pnpm dev` runs without errors.

- [ ] **T-101** Init Next.js project with TypeScript, Tailwind, ESLint, App Router, no src dir
  ```bash
  pnpm create next-app framemalang --typescript --tailwind --eslint --app --src-dir no --import-alias "@/*"
  cd framemalang
  ```
- [ ] **T-102** Install production dependencies
  ```bash
  pnpm add sanity @sanity/vision next-sanity @sanity/image-url @portabletext/react date-fns
  ```
- [ ] **T-103** Install dev dependencies
  ```bash
  pnpm add -D @types/node @vercel/analytics
  ```
- [ ] **T-104** `[P]` Init Sanity (embedded in repo)
  ```bash
  pnpm sanity init --env
  # Select: Create new project, dataset: production, embed in Next.js repo
  ```
- [ ] **T-105** Create folder structure
  ```bash
  mkdir -p app/(site)/artikel/[slug]
  mkdir -p app/(site)/kategori/[slug]
  mkdir -p app/(site)/penulis/[slug]
  mkdir -p app/(site)/hashtag/[slug]
  mkdir -p app/api/revalidate
  mkdir -p app/studio/[[...index]]
  mkdir -p components/article components/layout components/ui components/seo
  mkdir -p sanity/schema/documents sanity/schema/objects sanity/lib
  mkdir -p lib
  ```
- [ ] **T-106** Create `.env.example` with all required variables (see PLAN.md Section "Environment Variables")
- [ ] **T-107** Create `.env.local` from `.env.example` and fill in Sanity credentials
- [ ] **T-108** Update `next.config.ts` with Sanity CDN image remote patterns
- [ ] **T-109** Create `lib/types.ts` with TypeScript interfaces for Article, Author, Category, SiteSettings
- [ ] **T-110** Create `lib/utils.ts` with helpers (formatDate, slugify, cn for className merge)
- [ ] **T-111** Verify: `pnpm dev` runs, `/` renders, no TypeScript errors

---

### Milestone 2 — Schema & Studio

**Goal:** All Sanity document types defined. Studio runs at `/studio`. Can create article/author/category/site settings.

- [ ] **T-201** Create `sanity/lib/client.ts` — Sanity client configuration with project ID, dataset, API version, useCdn
- [ ] **T-202** Create `sanity/lib/image.ts` — Image URL builder using `@sanity/image-url`
- [ ] **T-203** Create `sanity/schema/objects/imageWithAlt.ts` — Image + alt text object
- [ ] **T-204** Create `sanity/schema/objects/seo.ts` — SEO override fields object
- [ ] **T-205** `[P]` Create `sanity/schema/documents/author.ts` — Author document (name, slug, photo, bio, social)
- [ ] **T-206** `[P]` Create `sanity/schema/documents/category.ts` — Category document (title, slug, description)
- [ ] **T-207** `[P]` Create `sanity/schema/documents/article.ts` — Article document (all fields per PLAN.md schema)
- [ ] **T-208** `[P]` Create `sanity/schema/documents/siteSettings.ts` — Singleton (title, tagline, logo, OG, social, footer)
- [ ] **T-209** Create `sanity/schema/index.ts` — Schema registry importing all document and object types
- [ ] **T-210** Create `sanity/sanity.config.ts` — Studio config with schema, basePath `/studio`
- [ ] **T-211** Create `app/studio/[[...index]]/page.tsx` — Embedded Sanity Studio route
- [ ] **T-212** Create `sanity/lib/queries.ts` — All 9 GROQ queries from PLAN.md
- [ ] **T-213** Seed Sanity: Create 3 categories (sosok, heritage, event) and site settings singleton
- [ ] **T-214** Verify: `/studio` loads Sanity Studio, can create articles and authors, schema validates

---

## Phase 2: Core Pages (M3)

### Milestone 3 — Core Pages

**Goal:** All public pages render with data from Sanity. ISR cache tags configured. Static params generated.

- [ ] **T-301** Create `components/layout/Container.tsx` — Max-width centered wrapper
- [ ] **T-302** Create `components/article/ArticleCard.tsx` — Card with image, title, excerpt, author, date, categories
- [ ] **T-303** Create `components/article/ArticleMeta.tsx` — Author byline, date, category badges
- [ ] **T-304** Create `components/article/ArticleBody.tsx` — Portable Text renderer with `@portabletext/react`
- [ ] **T-305** Create `components/layout/Header.tsx` — Site header with logo and navigation (Home, Sosok, Heritage, Event, Semua Artikel)
- [ ] **T-306** Create `components/layout/Footer.tsx` — Site footer with tagline, social links, copyright
- [ ] **T-307** Create `app/(site)/layout.tsx` — Root site layout wrapping Header + Footer around children
- [ ] **T-308** Create `app/(site)/page.tsx` — Homepage with featured section + recent articles list
  - Fetch featured articles (Q1) and recent articles (Q2)
  - ISR tag: `homepage`
  - Export `generateMetadata()` from site settings
- [ ] **T-309** Create `app/(site)/artikel/page.tsx` — Article listing page (all published, paginated)
  - ISR tag: `articles`
  - `generateStaticParams()` not needed (pagination is dynamic)
- [ ] **T-310** Create `app/(site)/artikel/[slug]/page.tsx` — Article detail page
  - Fetch article by slug (Q3)
  - ISR tags: `article:{slug}`, `articles`
  - `generateStaticParams()` from all published article slugs
  - `generateMetadata()` from article SEO fields or fallback
- [ ] **T-311** Create `app/(site)/kategori/[slug]/page.tsx` — Category listing page
  - Fetch articles by category (Q4)
  - ISR tag: `category:{slug}`
  - `generateStaticParams()` from all categories (Q7)
- [ ] **T-312** Create `app/(site)/penulis/[slug]/page.tsx` — Author profile page
  - Fetch author + their articles (Q5)
  - ISR tag: `author:{slug}`
  - `generateStaticParams()` from all authors
- [ ] **T-313** Create `app/(site)/hashtag/[slug]/page.tsx` — Hashtag listing page
  - Fetch articles by hashtag (Q6)
  - ISR tag: `hashtag:{slug}`
  - `generateStaticParams()` from all distinct hashtags (Q8)
- [ ] **T-314** Verify: All 7 page routes render correctly with seeded Sanity data

**Checkpoint:** At this point, the entire site renders with data. No ISR revalidation yet — that comes in M4.

---

## Phase 3: Infrastructure (M4)

### Milestone 4 — ISR Wiring

**Goal:** Webhook + revalidation working end-to-end. Publishing in Sanity purges relevant caches.

- [ ] **T-401** Create `app/api/revalidate/route.ts` — POST handler with secret validation and tag-based revalidation
- [ ] **T-402** Configure Sanity webhook: URL, trigger (create + publish + unpublish), secret header, projection `{ _type, "slug": slug }`
- [ ] **T-403** Test end-to-end: Publish article in Studio → verify webhook fires → verify ISR cache purged → verify new content appears
- [ ] **T-404** Test edge case: Unpublish article → verify page returns not-found
- [ ] **T-405** Test edge case: Invalid webhook secret → verify 401 response
- [ ] **T-406** Verify: Publishing site settings revalidates homepage and settings tag

**Checkpoint:** Content publish cycle is fully automated. No developer intervention needed for content updates.

---

## Phase 4: SEO Layer (M5)

### Milestone 5 — SEO Layer

**Goal:** Full SEO coverage: metadata, structured data, sitemap, robots.txt.

- [ ] **T-501** `[P]` Create `components/seo/ArticleJsonLd.tsx` — Article schema for article detail pages
- [ ] **T-502** `[P]` Create `components/seo/BreadcrumbJsonLd.tsx` — BreadcrumbList for category and hashtag pages
- [ ] **T-503** `[P]` Create `components/seo/PersonJsonLd.tsx` — Person schema for author profile pages
- [ ] **T-504** Integrate JSON-LD components into respective page components (T-310, T-311, T-312, T-313)
- [ ] **T-505** Ensure all pages export `generateMetadata()` with proper title, description, OG image, canonical URL
- [ ] **T-506** Create `app/sitemap.ts` — Dynamic sitemap from all published articles, categories, authors
- [ ] **T-507** Create `app/robots.ts` — Allow all except `/studio` and `/api/`
- [ ] **T-508** Add favicon and OG fallback image to `/public/`
- [ ] **T-509** Verify: Run Lighthouse audit on homepage and article page, score >= 85 for SEO

---

## Phase 5: Design (M6)

### Milestone 6 — Design Pass

**Goal:** Professional Tailwind styling, responsive layout, image optimization.

- [ ] **T-601** Configure `tailwind.config.ts` with custom theme (colors, fonts, spacing for the Frame brand)
- [ ] **T-602** Style Header: responsive nav with mobile hamburger menu, logo, category links
- [ ] **T-603** Style Footer: multi-column layout (about, categories, social), responsive stacking
- [ ] **T-604** Style Homepage: featured section (grid/hero), recent articles list, clean typography
- [ ] **T-605** Style ArticleCard: image aspect ratio, typography hierarchy, hover effects
- [ ] **T-606** Style Article Detail: hero image, body typography (Portable Text styles), sidebar meta
- [ ] **T-607** Style Category/Hashtag/Author listing pages: consistent card grid layout
- [ ] **T-608** Style Author Profile: photo, bio, social links, article list
- [ ] **T-609** Add `next/image` optimization for all Sanity images with responsive sizes
- [ ] **T-610** Mobile responsiveness audit: test all pages at 320px, 375px, 768px, 1024px, 1440px
- [ ] **T-611** Add page transitions and loading states (optional polish)
- [ ] **T-612** Verify: Lighthouse Performance >= 85 on homepage and article page

---

## Phase 6: Launch (M7)

### Milestone 7 — Launch

**Goal:** Production deployment, domain setup, smoke test.

- [ ] **T-701** Push to GitHub repository
- [ ] **T-702** Connect GitHub repo to Vercel
- [ ] **T-703** Set Vercel environment variables from `.env.example` values
- [ ] **T-704** Configure `framemalang.com` domain in Vercel (DNS settings)
- [ ] **T-705** Update Sanity CORS origins to include `https://framemalang.com`
- [ ] **T-706** Update Sanity webhook URL to `https://framemalang.com/api/revalidate`
- [ ] **T-707** Enable Vercel Analytics
- [ ] **T-708** Run full smoke test: all pages render, ISR works, SEO valid, mobile responsive
- [ ] **T-709** Create initial content: 2-3 articles per category, 1-2 authors, site settings
- [ ] **T-710** Submit sitemap to Google Search Console
- [ ] **T-711** Verify: Lighthouse full audit (Performance, Accessibility, Best Practices, SEO) all >= 85

---

## Task Summary

| Milestone | Tasks | Est. Effort | Dependencies |
|-----------|-------|-------------|--------------|
| M1 — Scaffold | T-101 to T-111 | 1-2 hours | None |
| M2 — Schema & Studio | T-201 to T-214 | 3-4 hours | M1 |
| M3 — Core Pages | T-301 to T-314 | 4-6 hours | M2 |
| M4 — ISR Wiring | T-401 to T-406 | 1-2 hours | M3 |
| M5 — SEO Layer | T-501 to T-509 | 2-3 hours | M3 |
| M6 — Design Pass | T-601 to T-612 | 4-6 hours | M3 |
| M7 — Launch | T-701 to T-711 | 1-2 hours | M4, M5, M6 |
| **Total** | **49 tasks** | **16-25 hours** | |

**Parallelizable tasks within milestones:**
- M1: T-104 (Sanity init) can run parallel to T-106/T-108/T-109/T-110
- M2: T-205, T-206, T-207, T-208 (all schema docs) can run in parallel
- M5: T-501, T-502, T-503 (JSON-LD components) can run in parallel
