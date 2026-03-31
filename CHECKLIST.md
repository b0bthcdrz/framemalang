# framemalang.com — Quality & Launch Checklist

> **Version:** 1.0.0 | **Status:** Active | **Owner:** Bob
> **Constitution Ref:** CONSTITUTION.md v1.0.0
> **Spec Ref:** SPEC.md v1.0.0
> **Created:** 2025-03-31 | **Last Updated:** 2025-03-31

---

## How to Use

This checklist is organized by category. Each item is numbered for reference (CHK001+). Items are grouped by phase — complete each phase before moving to the next. Mark items as you verify them. All items must pass before production launch (Phase 6).

---

## Phase 1: Scaffold Verification

| ID | Item | Status |
|----|------|--------|
| CHK001 | `pnpm dev` starts without errors | [ ] |
| CHK002 | No TypeScript compilation errors (`pnpm tsc --noEmit`) | [ ] |
| CHK003 | No ESLint errors (`pnpm lint`) | [ ] |
| CHK004 | `.env.local` exists with all required variables filled | [ ] |
| CHK005 | `.env.example` is committed with placeholder values | [ ] |
| CHK006 | `next.config.ts` has Sanity CDN in `images.remotePatterns` | [ ] |
| CHK007 | All folder structure directories exist per PLAN.md | [ ] |
| CHK008 | Git repo initialized with initial commit | [ ] |

---

## Phase 2: Sanity & Schema Verification

| ID | Item | Status |
|----|------|--------|
| CHK101 | `/studio` loads Sanity Studio without errors | [ ] |
| CHK102 | Article document type has all required fields (title, slug, publishedAt, status, author, categories, hashtags, mainImage, excerpt, body) | [ ] |
| CHK103 | Article optional fields present (seo, featured) | [ ] |
| CHK104 | Author document type has all fields (name, slug, photo, bio, social) | [ ] |
| CHK105 | Category document type has all fields (title, slug, description) | [ ] |
| CHK106 | siteSettings singleton has all fields (siteTitle, tagline, logo, defaultOGImage, socialLinks, footerText) | [ ] |
| CHK107 | seo object has all fields (metaTitle, metaDescription, ogImage, noIndex) | [ ] |
| CHK108 | imageWithAlt object has image + alt fields | [ ] |
| CHK109 | Can create a new article in Studio and set all fields | [ ] |
| CHK110 | Can create a new author in Studio | [ ] |
| CHK111 | 3 categories seeded: sosok, heritage, event | [ ] |
| CHK112 | siteSettings singleton created with initial values | [ ] |

---

## Phase 3: Page Rendering Verification

| ID | Item | Status |
|----|------|--------|
| CHK201 | Homepage (`/`) renders with site header and footer | [ ] |
| CHK202 | Homepage displays featured articles section | [ ] |
| CHK203 | Homepage displays recent articles list | [ ] |
| CHK204 | Article listing (`/artikel`) shows all published articles | [ ] |
| CHK205 | Article detail (`/artikel/{slug}`) renders full article with body, hero, author, categories | [ ] |
| CHK206 | Article detail page shows hashtags as clickable links | [ ] |
| CHK207 | Category page (`/kategori/sosok`) shows sosok articles | [ ] |
| CHK208 | Category page (`/kategori/heritage`) shows heritage articles | [ ] |
| CHK209 | Category page (`/kategori/event`) shows event articles | [ ] |
| CHK210 | Author page (`/penulis/{slug}`) shows author bio and their articles | [ ] |
| CHK211 | Hashtag page (`/hashtag/{slug}`) shows articles with that hashtag | [ ] |
| CHK212 | Non-existent article slug returns not-found page (not 500) | [ ] |
| CHK213 | Non-existent category slug returns not-found page | [ ] |
| CHK214 | All pages have correct ISR cache tags configured | [ ] |

---

## Phase 4: ISR & Webhook Verification

| ID | Item | Status |
|----|------|--------|
| CHK301 | `/api/revalidate` returns 401 when called without secret header | [ ] |
| CHK302 | `/api/revalidate` returns 200 when called with correct secret | [ ] |
| CHK303 | Publishing an article in Sanity triggers webhook to `/api/revalidate` | [ ] |
| CHK304 | After article publish, new article appears on homepage without rebuild | [ ] |
| CHK305 | After article publish, article detail page updates without rebuild | [ ] |
| CHK306 | After article publish, relevant category page updates without rebuild | [ ] |
| CHK307 | Unpublishing an article removes it from homepage and listing pages | [ ] |
| CHK308 | Updating site settings revalidates homepage | [ ] |
| CHK309 | Full publish-to-live cycle takes < 5 seconds | [ ] |

---

## Phase 5: SEO & Performance Verification

| ID | Item | Status |
|----|------|--------|
| CHK401 | Every page has `<title>` tag (no "Untitled" pages) | [ ] |
| CHK402 | Every page has `<meta name="description">` | [ ] |
| CHK403 | Article pages have Open Graph tags (og:title, og:description, og:image) | [ ] |
| CHK404 | Every page has canonical URL set | [ ] |
| CHK405 | Article detail pages include Article JSON-LD | [ ] |
| CHK406 | Category pages include BreadcrumbList JSON-LD | [ ] |
| CHK407 | Author pages include Person JSON-LD | [ ] |
| CHK408 | `/sitemap.xml` is accessible and lists all published articles, categories, authors | [ ] |
| CHK409 | `/robots.txt` is accessible and blocks `/studio`, `/api/` | [ ] |
| CHK410 | Lighthouse SEO score >= 85 (homepage) | [ ] |
| CHK411 | Lighthouse SEO score >= 85 (article detail) | [ ] |
| CHK412 | Lighthouse Performance score >= 85 (homepage) | [ ] |
| CHK413 | Lighthouse Performance score >= 85 (article detail) | [ ] |
| CHK414 | All images have alt text | [ ] |
| CHK415 | Favicon is present and loads correctly | [ ] |

---

## Phase 6: Launch Readiness (ALL above must pass)

| ID | Item | Status |
|----|------|--------|
| CHK501 | Code pushed to GitHub repository | [ ] |
| CHK502 | GitHub repo connected to Vercel | [ ] |
| CHK503 | Vercel environment variables set (all from .env.example) | [ ] |
| CHK504 | Domain `framemalang.com` configured in Vercel DNS | [ ] |
| CHK505 | Site loads at `https://framemalang.com` | [ ] |
| CHK506 | Sanity CORS origins include `https://framemalang.com` | [ ] |
| CHK507 | Sanity webhook URL updated to `https://framemalang.com/api/revalidate` | [ ] |
| CHK508 | ISR revalidation works on production (test publish cycle) | [ ] |
| CHK509 | Vercel Analytics enabled | [ ] |
| CHK510 | At least 2-3 articles seeded per category | [ ] |
| CHK511 | At least 1-2 authors seeded | [ ] |
| CHK512 | Site settings configured with logo, tagline, social links | [ ] |
| CHK513 | Sitemap submitted to Google Search Console | [ ] |
| CHK514 | Mobile responsiveness verified (320px, 375px, 768px, 1024px, 1440px) | [ ] |
| CHK515 | All links in navigation are functional | [ ] |
| CHK516 | No console errors in browser on any page | [ ] |
| CHK517 | Monthly hosting cost confirmed at $0.00 | [ ] |
