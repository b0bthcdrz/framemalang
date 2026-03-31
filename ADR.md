# framemalang.com — Architecture Decision Records

> **Version:** 1.0.0 | **Status:** Active | **Owner:** Bob
> **Constitution Ref:** CONSTITUTION.md v1.0.0
> **Created:** 2025-03-31 | **Last Updated:** 2025-03-31

---

## Purpose

This document records significant architectural decisions for the framemalang.com project. Each ADR captures the context, decision, rationale, and rejected alternatives. ADRs are immutable once recorded — new information results in a new ADR that supersedes the old one.

---

## ADR-001 — CMS: Sanity over Payload

| Field | Value |
|-------|-------|
| **Date** | 2025-03 |
| **Status** | Accepted |
| **Decider** | Bob |

### Context

The project needs a headless CMS for editorial content management. The CMS must run on a free tier, provide a good editor experience, and integrate cleanly with Next.js ISR. Options considered: Sanity v3, Payload CMS, Keystatic, Hygraph.

### Decision

Use Sanity v3 as the headless CMS with Sanity Studio v3 embedded in the Next.js app at `/studio`.

### Rationale

- Payload CMS is too heavy for free serverless infrastructure. Cold starts on Vercel serverless functions destroy the editor UX — editors would wait 5-10 seconds for the admin panel to become interactive on first load. For a media outlet where editors publish daily, this is unacceptable.
- Sanity is a fully managed SaaS — there are no cold starts because the Studio and API run on Sanity's own infrastructure, not on Vercel. The GROQ API hits Sanity's CDN directly, providing fast query responses regardless of content volume.
- Sanity's free tier is generous for a single media outlet: unlimited API requests, sufficient storage, and the embedded Studio means no additional hosting cost.
- Sanity Studio can be embedded directly in the Next.js app at `/studio` via `next-sanity`, eliminating the need for a separate deployment or subdomain.
- GROQ (Graph-Relational Object Queries) is expressive enough for all media outlet query patterns: filtering by status, joining author/category references, pagination, and sorting.

### Rejected Alternatives

| Alternative | Reason for Rejection |
|------------|---------------------|
| Payload CMS | Too heavy for free infra; cold start problem makes editor UX unacceptable |
| Keystatic | Git-based CMS means every publish triggers a Vercel build; not suitable for frequent content updates; requires developer knowledge for editors |
| Hygraph | GraphQL schema verbosity adds unnecessary complexity at this scale; free tier is less generous than Sanity |

### Consequences

- Content editors use Sanity's cloud-hosted Studio — no local Studio process needed
- All content queries go through GROQ — team must learn GROQ syntax
- Asset storage is on Sanity's CDN — no local media management
- Vendor dependency on Sanity Inc., but SaaS CMS providers are easily swappable via the API layer

---

## ADR-002 — ISR Strategy: Tag-based On-Demand Revalidation

| Field | Value |
|-------|-------|
| **Date** | 2025-03 |
| **Status** | Accepted |
| **Decider** | Bob |

### Context

Content changes must go live quickly without requiring full site rebuilds. Vercel's free tier limits builds to 6,000 minutes/month and 100 deployments/day. A media outlet publishing multiple articles per day could burn through build quota if each publish triggers a rebuild. Next.js offers three caching strategies: static generation, ISR with time-based revalidation, and ISR with on-demand tag-based revalidation.

### Decision

Use Next.js tag-based `revalidateTag()` triggered by Sanity webhook for on-demand ISR revalidation.

### Rationale

- Time-based ISR (`revalidate: 60`) introduces a stale content window of up to 60 seconds. For a news/media outlet, stale content is unacceptable — readers expect to see published articles immediately.
- Full site rebuild on every content publish would burn through Vercel's 6,000 build minutes/month rapidly. Even at 2-minute builds, 50 articles/month would consume 100 minutes — and that's without any code changes. The real risk is that routine content publishing could push the project near the free-tier limit.
- Tag-based revalidation provides instant publish with granular cache control. Publishing an article purges only the relevant caches (the article page, the article listing, the homepage, and the relevant category page) — not the entire site.
- The webhook pattern is simple: Sanity fires a POST to `/api/revalidate` on publish, the API route calls `revalidateTag()` with the appropriate tags, and the cache is purged within seconds.

### Rejected Alternatives

| Alternative | Reason for Rejection |
|------------|---------------------|
| Time-based ISR (`revalidate: 60`) | Stale content window unacceptable for media outlet |
| Full rebuild on publish | Burns Vercel free build quota; slow (minutes vs seconds) |
| No caching (SSR) | Wastes serverless invocations; slower for readers; defeats CDN benefits |

### Consequences

- Content publish is instant (no build required)
- Only code changes trigger Vercel builds
- Webhook secret must be kept secure (stored in Vercel env vars, never committed)
- Tag naming convention must be documented and followed consistently

---

## ADR-003 — No Separate Staging Environment (v1)

| Field | Value |
|-------|-------|
| **Date** | 2025-03 |
| **Status** | Accepted |
| **Decider** | Bob |

### Context

Some projects maintain separate staging and production environments (separate Vercel projects and Sanity datasets). This adds complexity but provides a safety net for content review before publishing.

### Decision

Use a single Sanity project (production dataset) and a single Vercel deployment. Rely on Sanity's native draft system for content review.

### Rationale

- The project has a single operator (solo founder/editor) — content risk is low. There is no need for a multi-reviewer approval workflow at launch.
- Sanity's free tier allows only 1 non-production project. Reserving the non-production slot for future use (e.g., a Frame[City] franchise site) is more strategic than using it for staging.
- Sanity's draft system already provides content preview capability. Editors can save drafts, preview them in Studio, and publish when ready. This is sufficient for a single-operator editorial workflow.
- A separate staging environment doubles the Sanity dataset management overhead, adds complexity to webhook configuration, and requires maintaining two sets of environment variables.

### Rejected Alternatives

| Alternative | Reason for Rejection |
|------------|---------------------|
| Separate staging Vercel + Sanity project | Wastes free tier slots; unnecessary overhead for single-operator v1 |
| Preview deployment per PR | Vercel free tier allows this but adds no value when there's one contributor |

### Consequences

- All content is published directly to production
- Draft preview relies on Sanity's built-in draft mode
- If the project grows to multiple editors, staging should be reconsidered (new ADR required)

---

## ADR-004 — Images: Sanity CDN Only

| Field | Value |
|-------|-------|
| **Date** | 2025-03 |
| **Status** | Accepted |
| **Decider** | Bob |

### Context

Editorial images (hero images, author photos, inline body images) need to be stored, optimized, and served to readers. Options include Vercel's `/public` folder, Sanity's asset storage, or a third-party image CDN (Cloudinary, Imgix). The constraint is that Vercel's free tier provides 100 GB bandwidth/month, and image delivery is typically the largest bandwidth consumer.

### Decision

All editorial images are uploaded to Sanity's asset storage and served via `cdn.sanity.io` with URL-based transforms for resizing, format conversion (WebP/AVIF), and quality adjustment.

### Rationale

- Sanity's image pipeline handles all common image optimization needs via URL parameters: width, height, fit, format (auto WebP/AVIF), and quality. No separate image processing service is needed.
- Serving images from Sanity's CDN keeps Vercel bandwidth usage low. For a media outlet with potentially dozens of images per page, this is critical for staying within the 100 GB/month free tier.
- The `@sanity/image-url` package provides a type-safe builder for image URLs, making it easy to generate optimized URLs in React components and Next.js `Image` components.
- Adding Cloudinary or similar would introduce a third SaaS dependency for no additional benefit — Sanity's image pipeline already does everything needed.

### Rejected Alternatives

| Alternative | Reason for Rejection |
|------------|---------------------|
| Vercel `/public` folder | Wastes Vercel bandwidth quota; no dynamic transforms; requires manual optimization |
| Cloudinary free tier | Unnecessary third SaaS dependency; Sanity already provides equivalent functionality |
| Next.js Image Optimization | Only works for server-side images; increases serverless function invocations |

### Consequences

- All images uploaded via Sanity Studio
- Next.js `Image` component configured with `remotePatterns` for `cdn.sanity.io`
- No images stored in git or Vercel `/public` (except favicons and OG fallback)
- Image optimization is URL-based, not build-time

---

## ADR-005 — Routing: Indonesian Language URLs

| Field | Value |
|-------|-------|
| **Date** | 2025-03 |
| **Status** | Accepted |
| **Decider** | Bob |

### Context

The site's URL structure affects SEO, user experience, and brand identity. Options include English routes (`/article`, `/category`, `/author`, `/tag`) or Indonesian routes (`/artikel`, `/kategori`, `/penulis`, `/hashtag`).

### Decision

Use Indonesian language URL prefixes: `/artikel`, `/kategori`, `/penulis`, `/hashtag`.

### Rationale

- The primary SEO target audience is Indonesian speakers searching for hyperlocal Malang content in Bahasa Indonesia. Indonesian URL slugs improve click-through rate in local SERPs because the URL matches the user's language and search query.
- Google and other search engines use URL keywords as a minor ranking signal. Having `/kategori/heritage` rather than `/category/heritage` adds marginal but free SEO benefit for Indonesian-language queries.
- The brand identity is explicitly Indonesian — "Frame Malang" covers Indonesian stories for Indonesian readers. English URLs would feel disconnected from the brand and audience.
- Indonesian URLs do not add any technical complexity — they are just string constants in the route definitions and navigation components.

### Rejected Alternatives

| Alternative | Reason for Rejection |
|------------|---------------------|
| English routes (`/article`, `/category`) | Misaligns with SEO audience; lower CTR in Indonesian SERPs |
| Mixed routes (English for pages, Indonesian for slugs) | Inconsistent; confusing for users and crawlers |

### Consequences

- Route constants must use Indonesian strings
- Navigation links use Indonesian labels
- All documentation and code comments reference Indonesian route paths
- If expanding to English audience in v2, i18n routing would need a new ADR

---

## ADR-006 — Categories: Fixed Three (sosok, heritage, event)

| Field | Value |
|-------|-------|
| **Date** | 2025-03 |
| **Status** | Accepted |
| **Decider** | Bob |

### Context

The editorial taxonomy needs a category system. Options include a flat open-ended category list, a hierarchical taxonomy, or a fixed small set of categories. The frontend design specifies exactly three categories displayed in the navigation.

### Decision

Use exactly three fixed categories: **sosok** (people/personalities), **heritage** (history/culture), **event** (events/happenings). Free-form hashtags provide additional flexibility beyond these three.

### Rationale

- Three categories keep the navigation clean and scannable. A long category list in the header would clutter the UI, especially on mobile where horizontal space is limited.
- The categories map directly to the editorial pillars of framemalang.com: covering Malang's notable people (sosok), historical and cultural stories (heritage), and current events (event). These are the three content types the outlet was founded to cover.
- While categories are stored as Sanity documents (allowing future expansion), the navigation and design assume exactly three. Adding more categories would require a design and navigation redesign — not just a CMS change.
- Hashtags (`/hashtag/{slug}`) provide the escape valve for content that doesn't fit neatly into one of the three categories. An article about a "sosok" at a "heritage" site can be categorized as "sosok" and hashtagged with both topics.

### Rejected Alternatives

| Alternative | Reason for Rejection |
|------------|---------------------|
| Open-ended category creation | Clutters navigation; inconsistent taxonomy; harder to design for |
| Hierarchical categories (parent/child) | Over-engineered for v1; adds complexity to queries and navigation |
| Single category per article | Too restrictive; some stories span multiple editorial pillars |

### Consequences

- Navigation displays exactly 3 category links
- `generateStaticParams()` for categories returns 3 slugs
- Adding a 4th category requires design review and navigation update
- Hashtags are the recommended way to add granular topical tags

---

## ADR-007 — Hashtag over Tag: Social-Native Terminology

| Field | Value |
|-------|-------|
| **Date** | 2025-03 |
| **Status** | Accepted |
| **Decider** | Bob |

### Context

The original spec used `/tag/{slug}` for free-form content tagging. The frontend design specifies "hashtag" as the term, and the social media convention of `#hashtag` is more familiar to Indonesian internet users than the generic "tag" terminology.

### Decision

Rename the tag system to "hashtag" throughout: route `/hashtag/{slug}`, ISR tag `hashtag:{slug}`, UI label "Hashtag", display format `#sosok-malang`.

### Rationale

- The term "hashtag" is universally understood in Indonesia due to Instagram, Twitter/X, and TikTok usage. Using "hashtag" instead of "tag" immediately communicates the concept to content editors and readers.
- The `#` prefix in the display format (e.g., `#kota-lama`, `#festival-malang`) reinforces the social media association and makes hashtags feel native and shareable.
- This is a naming change only — the underlying implementation (string array on articles, GROQ query, ISR tag) is identical to the original "tag" design. No technical complexity is added.

### Rejected Alternatives

| Alternative | Reason for Rejection |
|------------|---------------------|
| `/tag/{slug}` | Less familiar term; doesn't match frontend design spec |
| `/topik/{slug}` | "Topik" is less social-native than "hashtag" |

### Consequences

- Route path: `/hashtag/{slug}` (not `/tag/{slug}`)
- ISR cache tag: `hashtag:{slug}` (not `tag:{slug}`)
- UI displays hashtags with `#` prefix
- GROQ query references `hashtags[]` array field on article documents

---

## ADR-008 — Styling: Tailwind CSS with Custom Theme

| Field | Value |
|-------|-------|
| **Date** | 2025-03 |
| **Status** | Accepted |
| **Decider** | Bob |

### Context

The site needs a styling solution that supports responsive design, rapid iteration, and consistent theming. Options include Tailwind CSS, CSS Modules, styled-components, or a component library (shadcn/ui, Chakra UI).

### Decision

Use Tailwind CSS v3 with a custom theme defined in `tailwind.config.ts`. No external component library at v1.

### Rationale

- Tailwind CSS provides utility-first classes that enable rapid UI development without context-switching between CSS files and components. For a solo developer building a media outlet, development speed matters more than abstraction elegance.
- Mobile-first responsive design is Tailwind's default approach, matching the project's requirement for mobile-dominant Indonesian traffic.
- A custom theme in `tailwind.config.ts` ensures brand consistency (colors, typography, spacing) without the overhead of a full component library.
- Component libraries like shadcn/ui or Chakra UI add bundle size and learning curve. For a content-heavy site with relatively simple UI patterns (article cards, lists, navigation), the utility-first approach is sufficient.
- If the project scales and needs more complex UI components (forms, modals, data tables) in v2, a component library can be added incrementally without rewriting existing styles.

### Rejected Alternatives

| Alternative | Reason for Rejection |
|------------|---------------------|
| CSS Modules | More files to manage; no utility-first speed |
| styled-components | Runtime overhead; bundle size; React-specific |
| shadcn/ui + Radix | Overkill for content site; adds complexity for simple UI needs |
| Chakra UI | Large bundle size; opinionated design system may conflict with brand |

### Consequences

- All styling via Tailwind utility classes in JSX
- Custom theme values defined in `tailwind.config.ts`
- No global CSS files (except Tailwind directives)
- Consistent design tokens across all components
