# framemalang.com — Feature Specification

> **Version:** 1.0.0 | **Status:** Approved | **Owner:** Bob
> **Constitution Ref:** CONSTITUTION.md v1.0.0
> **Created:** 2025-03-31 | **Last Updated:** 2025-03-31

---

## Overview

framemalang.com is a hyperlocal digital media outlet covering Malang's history, culture, and personalities. The platform provides a fast, SEO-optimized reading experience built on a headless CMS (Sanity) with ISR-served static pages on Vercel's free tier. The editorial model uses three fixed categories — **sosok** (people), **heritage** (history/culture), **event** (events) — and free-form hashtags for flexible content tagging.

This spec defines what the system must do, who it serves, and what success looks like. The implementation details live in PLAN.md; the task breakdown lives in TASKS.md.

---

## Problem Statement

Malang has a rich cultural identity — from colonial-era heritage buildings to thriving creative communities and local events — but there is no dedicated digital outlet that covers these stories in a structured, searchable, and SEO-friendly way. Existing coverage is fragmented across social media, generic news portals, and personal blogs with no editorial consistency or discoverability.

framemalang.com fills this gap by providing a purpose-built platform for hyperlocal Malang storytelling, optimized for Indonesian search queries, and designed to scale to other cities under the Frame[City] brand.

---

## Target Audience

| Segment | Description | Primary Need |
|---------|-------------|-------------|
| Malang residents | Locals curious about their city's stories | Discover hidden histories, notable people, upcoming events |
| Indonesian tourists | Visitors planning a trip to Malang | Find cultural sites, events, and local personalities to follow |
| Researchers & students | Academic or journalistic research on Malang | Access well-structured, citable articles with proper metadata |
| Content creators | Local writers and photographers | A credible platform to publish and build authority |

---

## User Stories

### Priority 1 — Must Have (Launch Blockers)

#### US-001: As a reader, I want to browse the homepage and see the latest featured and recent articles so I can quickly find what's new.

The homepage must display a prominent featured article section (articles marked `featured: true` in Sanity) and a chronological list of recent articles. Each article card shows the title, excerpt, main image, author name, publication date, and associated categories. The featured section should display up to 5 articles and be visually distinct from the regular article feed. The homepage must load as a statically cached page (ISR) and revalidate when new content is published.

**Acceptance Criteria:**
- Homepage renders with featured articles section and recent articles list
- Each article card displays: title, excerpt (180 chars), main image, author name, date, categories
- Featured section shows up to 5 articles with `featured: true`
- Page is served from Vercel Edge CDN with ISR cache tags `homepage`
- Revalidates on publish via webhook

#### US-002: As a reader, I want to read a full article with rich content (images, headings, blockquotes, lists) so I can engage with the story.

The article detail page renders the full Portable Text body from Sanity, including all block types (paragraphs, headings, images, blockquotes, lists, code blocks). The page displays the hero image (mainImage), title, publication date, author byline with photo, categories, and hashtags. SEO metadata is generated from the article's SEO fields or falls back to the article title and excerpt.

**Acceptance Criteria:**
- Article page renders at `/artikel/{slug}` with full Portable Text body
- Hero image, title, date, author (with photo), categories, and hashtags are displayed
- SEO metadata: `<title>`, `<meta description>`, Open Graph tags, canonical URL
- JSON-LD structured data (Article schema) is injected
- Page uses ISR with tags `article:{slug}` and `articles`
- Returns 404 for non-existent slugs with proper not-found UI

#### US-003: As a reader, I want to browse articles by category (sosok, heritage, event) so I can find content by topic.

Each category has its own listing page at `/kategori/{slug}` showing all published articles in that category, sorted by publication date (newest first). The page displays the category title, description, and a paginated article list. Only the three fixed categories exist: sosok, heritage, event.

**Acceptance Criteria:**
- Category pages render at `/kategori/sosok`, `/kategori/heritage`, `/kategori/event`
- Each page shows category title, description, and article list
- Articles are paginated (configurable page size)
- ISR with tag `category:{slug}` for on-demand revalidation
- `generateStaticParams()` pre-generates all 3 category pages

#### US-004: As an editor, I want to create and publish articles in Sanity Studio so that content goes live without developer intervention.

Sanity Studio is embedded at `/studio` within the Next.js app. Editors can create articles with all required fields (title, slug, body, main image, excerpt, author, categories, hashtags, SEO). When an article status is set to "published," Sanity sends a webhook to `/api/revalidate` which purges the relevant ISR caches. Draft preview is supported via Sanity's native draft system.

**Acceptance Criteria:**
- Sanity Studio loads at `/studio`
- Article document type with all required and optional fields
- Status field (draft/published/archived) controls visibility
- On publish, webhook fires to `/api/revalidate`
- ISR cache for the article, article listing, homepage, and relevant category pages is purged
- Draft articles are not visible on the public site

#### US-005: As an editor, I want to manage authors and categories from Sanity Studio so that the editorial team can grow over time.

Sanity provides document types for `author` (name, slug, photo, bio, social links) and `category` (title, slug, description). These are referenced in articles via Sanity reference fields. Author profile pages are generated at `/penulis/{slug}`.

**Acceptance Criteria:**
- Author document type with name, slug, photo, bio, social links
- Category document type with title, slug, description
- Author profile pages at `/penulis/{slug}` with bio, photo, and their articles
- ISR with tag `author:{slug}` for on-demand revalidation

---

### Priority 2 — Should Have (v1 Complete)

#### US-006: As a reader, I want to browse articles by hashtag so I can discover related content across categories.

Hashtag pages at `/hashtag/{slug}` display all published articles containing that hashtag in their tags array. Hashtags are free-form strings entered by editors — there is no predefined hashtag vocabulary. This provides flexible cross-category discovery.

**Acceptance Criteria:**
- Hashtag pages render at `/hashtag/{slug}`
- Shows all articles with matching tag, sorted by publication date
- ISR with tag `hashtag:{slug}`
- Hashtag links are clickable from article detail pages

#### US-007: As a reader, I want to see a site header with navigation and a footer with site info on every page so I can orient myself and find key sections.

The site layout includes a persistent header (logo/site title, navigation links to homepage, categories, and article listing) and a footer (site description, social links, copyright). Both are rendered in the `(site)/layout.tsx` route group layout.

**Acceptance Criteria:**
- Header displays site logo/title and navigation links
- Navigation includes: Home, Sosok, Heritage, Event, Semua Artikel
- Footer displays site tagline, social links, and copyright
- Header and footer are consistent across all public pages
- Studio route (`/studio`) is excluded from the site layout

#### US-008: As search engines, I want structured data, sitemaps, and robots.txt so I can properly index the site's content.

Every content page includes relevant JSON-LD structured data. A dynamic sitemap is generated from all published articles, categories, authors, and hashtags. A robots.txt blocks `/studio` and `/api/` from crawling.

**Acceptance Criteria:**
- Article pages include Article JSON-LD schema
- Category and hashtag pages include BreadcrumbList JSON-LD
- Author pages include Person JSON-LD
- `/sitemap.xml` auto-generated from Sanity content
- `/robots.txt` blocks `/studio` and `/api/`
- Canonical URLs set on every page

---

### Priority 3 — Nice to Have (Post-Launch)

#### US-009: As a reader, I want responsive design that works well on mobile devices so I can read articles on my phone.

The entire site must be responsive using Tailwind CSS utility classes. Mobile-first approach: layouts stack vertically on small screens and expand to multi-column on larger screens. Images are responsive via Sanity's URL-based image transforms.

#### US-010: As an editor, I want a "featured" toggle on articles so I can curate the homepage.

A boolean field `featured` on the article document type. Articles with `featured: true` appear in the homepage featured section. The query fetches up to 5 featured articles sorted by publication date.

---

## Functional Requirements

| ID | Requirement | Priority | Notes |
|----|------------|----------|-------|
| FR-001 | Homepage serves featured + recent articles | P1 | ISR with tag `homepage` |
| FR-002 | Article detail at `/artikel/{slug}` | P1 | ISR with tags `article:{slug}`, `articles` |
| FR-003 | Category listing at `/kategori/{slug}` | P1 | ISR with tag `category:{slug}`; 3 fixed categories |
| FR-004 | Sanity Studio at `/studio` | P1 | Embedded, not separate deployment |
| FR-005 | ISR revalidation via webhook at `/api/revalidate` | P1 | POST with secret header |
| FR-006 | Author profile at `/penulis/{slug}` | P1 | ISR with tag `author:{slug}` |
| FR-007 | Hashtag listing at `/hashtag/{slug}` | P2 | ISR with tag `hashtag:{slug}` |
| FR-008 | Site header + footer layout | P2 | Consistent across all `(site)` routes |
| FR-009 | SEO metadata on every page | P2 | `generateMetadata()` + JSON-LD |
| FR-010 | Sitemap + robots.txt | P2 | Dynamic from Sanity content |
| FR-011 | Responsive design (mobile-first) | P3 | Tailwind CSS |
| FR-012 | Site settings singleton (logo, tagline, social) | P1 | Sanity `siteSettings` document |

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|------------------|
| Article slug conflict | Sanity enforces unique slugs per document type |
| Deleted article revalidation | Sanity webhook fires on unpublish; ISR tags purged; page returns not-found on next request |
| Unpublished article accessed directly | Article query filters `status == "published"`; unpublished articles return not-found |
| Category with zero articles | Category page renders with empty state message |
| Sanity webhook secret mismatch | `/api/revalidate` returns 401 Unauthorized |
| Missing main image on article | Article renders without hero image; no layout break |
| Author deleted but referenced by article | Sanity reference integrity; author field shows fallback or null state |

---

## Success Criteria

| ID | Metric | Target |
|----|--------|--------|
| SC-001 | Homepage Lighthouse Performance | >= 90 |
| SC-002 | Article page Lighthouse Performance | >= 85 |
| SC-003 | Time from Sanity publish to live | < 5 seconds |
| SC-004 | Monthly hosting cost | $0.00 |
| SC-005 | Vercel build minutes per month | < 60 (only on code pushes) |

---

## Assumptions

1. A Sanity account exists (free tier) with project ID and API tokens
2. The domain `framemalang.com` is registered and can be pointed to Vercel
3. The editorial team consists of 1–3 people with basic Sanity Studio familiarity
4. Content volume will be < 50 articles/month at launch (well within free-tier limits)
5. Readers primarily access the site from Indonesia (mobile-dominant market)
6. No user-generated content is required at v1


## Non-Functional Requirements (Implementation-Critical)

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Publish-to-live latency | <= 5 seconds (p95) |
| NFR-002 | First meaningful render on 4G mobile | <= 2.5 seconds on homepage |
| NFR-003 | Content query failure tolerance | Graceful fallback UI, never crash to 500 for recoverable states |
| NFR-004 | 404 correctness | Unknown article/category/author/hashtag must return proper not-found UI |
| NFR-005 | Metadata completeness | Every public page returns title + description + canonical |
| NFR-006 | Cache correctness | No stale critical content after publish/unpublish webhook |

## Tricky Scenarios & Expected Behavior

| Scenario | Why Tricky | Expected Behavior |
|----------|------------|------------------|
| Slug rename after publish | Old URL may still be indexed | New slug works; old slug returns 404 (or redirect if implemented intentionally) and related tags revalidated |
| Article with missing optional SEO | Frequent editorial omission | Fallback to title + excerpt + default OG image |
| Hashtag casing mismatch (`Malang` vs `malang`) | Free-form input can fragment pages | Normalize slug generation/canonicalization to lowercase; display original label in UI |
| Category exists but empty | Common at startup | Render valid page with zero-state guidance, not 404 |
| Webhook duplicate deliveries | Common distributed-system behavior | Revalidation endpoint must be idempotent and still return success |
| Author removed from published article | Referential drift | Article remains readable with fallback byline text and no runtime crash |
| Draft accidentally linked | Query/filter mistakes | Only `status == 'published'` appears on public routes |

## Data Contracts (Minimal Stable Shape)

To reduce context load during implementation, the following minimal shapes are mandatory and stable for v1:

- **ArticleCard contract:** `title`, `slug`, `excerpt`, `mainImage?`, `publishedAt`, `author.name?`, `categories[]`
- **ArticleDetail contract:** ArticleCard fields + `body`, `hashtags[]`, `seo?`, `author.photo?`, `author.slug?`
- **CategoryPage contract:** `category.title`, `category.slug`, `category.description?`, `articles[]`, `pagination`
- **AuthorPage contract:** `author.name`, `author.slug`, `author.bio?`, `author.photo?`, `articles[]`
- **SiteSettings contract:** `siteTitle`, `tagline?`, `logo?`, `defaultOGImage?`, `socialLinks[]`, `footerText?`
