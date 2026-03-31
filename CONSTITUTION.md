# framemalang.com — Project Constitution

> **Version:** 1.0.0 | **Status:** Ratified | **Owner:** Bob
> **Created:** 2025-03-31 | **Last Updated:** 2025-03-31

---

## Purpose

This document establishes the governing principles, constraints, and non-negotiable standards for the framemalang.com project. Every architectural decision, code contribution, and feature implementation must align with the principles defined here. If a conflict arises between a proposed change and this constitution, the constitution prevails — the change must be revised or a formal amendment process must be initiated.

framemalang.com is a hyperlocal digital media outlet covering Malang history, culture, and personalities. It must serve Indonesian readers with fast, SEO-optimized content delivery while maintaining zero hosting costs on Vercel's free tier.

---

## Core Principles

### 1. Zero-Cost First

All infrastructure and third-party services must operate within free-tier limits. This is a non-negotiable constraint. Before adopting any new dependency or service, the contributor must verify that it offers a free tier sufficient for the project's scale and document the free-tier limits in the relevant ADR. If a dependency requires payment at any foreseeable scale, it must be rejected unless a free equivalent exists.

**Implications:**
- Vercel free tier (100 GB bandwidth, 6000 build minutes, 100k serverless invocations/month) is the hard ceiling
- Sanity CMS free tier is the content backend
- No paid CDNs, image services, or analytics tools
- All images served via Sanity CDN, never stored in Vercel `/public`

### 2. SEO Dominance on Hyperlocal Queries

Every page must be built with search engine optimization as a primary concern, not an afterthought. The target audience is Indonesian speakers searching for hyperlocal Malang content. All URL slugs, metadata, structured data, and content structure must optimize for this audience.

**Implications:**
- Indonesian-language URL prefixes (`/artikel`, `/kategori`, `/penulis`, `/hashtag`)
- Every page exports `generateMetadata()` with proper Open Graph and canonical URLs
- Structured data (JSON-LD) on all content pages: Article, BreadcrumbList, Person
- Auto-generated `sitemap.xml` and `robots.txt`
- Static-first serving via ISR — no SSR for public pages

### 3. Editorial Velocity Over Developer Overhead

The publish cycle must be fast. Content editors should be able to publish and see changes live within seconds, without requiring developer intervention, builds, or deployments. The system architecture must prioritize editorial workflow efficiency over development convenience.

**Implications:**
- On-demand ISR revalidation via Sanity webhook, not time-based or rebuild-based
- Tag-based cache purging for granular control
- Sanity Studio embedded at `/studio` for seamless editing
- No content-related builds — only code pushes trigger Vercel builds

### 4. Indonesian Identity in Every Layer

The product's language, design tone, and content categories reflect its identity as an Indonesian hyperlocal outlet. This goes beyond translation — it means the information architecture, URL structure, and category taxonomy must feel native to Indonesian readers.

**Implications:**
- Three editorial categories only: **sosok** (people/personalities), **heritage** (history/culture), **event** (events/happenings)
- Free-form hashtags instead of rigid tag taxonomy
- Indonesian route prefixes throughout
- Content is written in Bahasa Indonesia; UI chrome may use minimal English (brand names)

### 5. Franchise-Ready Architecture

While v1 serves Malang, the codebase and content model must be structured so that expanding to other cities (e.g., framesurabaya.com, framejogja.com) requires minimal architectural changes. Content is city-specific, but the platform is city-agnostic.

**Implications:**
- Site settings are a singleton, not hardcoded
- Category slugs and editorial taxonomy are configurable via Sanity
- No Malang-specific logic buried in components
- Domain and branding are environment-variable-driven where possible

---

## Scope Boundaries

### In Scope (v1)

| Area | Details |
|------|---------|
| Public-facing site | Homepage, article listing, article detail, category pages, author profiles, hashtag pages |
| CMS | Sanity Studio embedded at `/studio` with full editorial workflow |
| ISR | Tag-based on-demand revalidation via webhook |
| SEO | Metadata, sitemap, robots.txt, JSON-LD structured data |
| Analytics | Vercel Analytics (passive, no dashboard) |
| Assets | All images via Sanity CDN with URL-based transforms |

### Out of Scope (v1)

| Area | Reason |
|------|--------|
| User accounts / comments | Unnecessary for v1 launch; defer to v2 |
| Newsletter integration | Requires email service with potential cost; defer to v2 |
| Paid content / paywalls | Contradicts free-tier principle at scale |
| Multi-language (ID + EN) | All content is Indonesian; English not needed at v1 |
| Search UI (Pagefind) | Sanity native search sufficient for editorial; defer to v2 |
| Analytics dashboard | Vercel Analytics passive-only at launch |
| Separate staging environment | Single production dataset; draft preview via Sanity sufficient |

---

## Governance

### Amendment Process

1. Propose amendment via GitHub issue with `constitution` label
2. Discuss with project owner (Bob) and any active contributors
3. If approved, update this document, bump version, and note the change in the changelog
4. No constitutional change may break an existing ADR without a superseding ADR

### ADR Authority

Architecture Decision Records (ADRs) document specific technical choices. ADRs may be created by any contributor but must reference this constitution and may not violate core principles. Conflicting ADRs must be resolved through the amendment process or by superseding the older ADR.

### Code of Conduct

- Bahasa Indonesia for all editorial content and user-facing communication
- English for code, commits, PRs, and technical documentation
- Squash-merge to `main` with conventional commit messages
- No direct pushes to `main` — all changes via PR (even for single-contributor projects, this preserves history)

---

## Ratification

| Role | Name | Date |
|------|------|------|
| Project Owner | Bob | 2025-03-31 |
| Tech Architect | Bob | 2025-03-31 |
