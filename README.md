# framemalang.com — Spec Kit

> Spec-Driven Development plan set for the Frame Malang hyperlocal digital media outlet.
> Follows the [GitHub Spec-Kit](https://github.com/github/spec-kit) methodology.

---

## Document Index

| Document | Purpose | Status |
|----------|---------|--------|
| [CONSTITUTION.md](./CONSTITUTION.md) | Project principles, governance, scope boundaries, amendment process | Ratified |
| [SPEC.md](./SPEC.md) | Feature specification with user stories, functional requirements, success criteria | Approved |
| [PLAN.md](./PLAN.md) | Technical implementation plan with architecture, schema, queries, ISR strategy | Approved |
| [TASKS.md](./TASKS.md) | Actionable task breakdown organized into 7 milestones (49 tasks) | Active |
| [CHECKLIST.md](./CHECKLIST.md) | Quality & launch verification checklist (56 items across 6 phases) | Active |
| [ADR.md](./ADR.md) | Architecture Decision Records (8 decisions documented) | Active |

---

## Workflow

```
CONSTITUTION → SPEC → PLAN → TASKS → CHECKLIST
                        ↓
                       ADR
```

1. **CONSTITUTION** — Establish non-negotiable principles and governance
2. **SPEC** — Define what to build (user stories, requirements, success criteria)
3. **PLAN** — Define how to build it (architecture, schema, queries, infrastructure)
4. **TASKS** — Break into executable tasks with milestones and dependencies
5. **CHECKLIST** — Verify quality before launch
6. **ADR** — Record and justify architectural decisions

---

## Key Customizations

This spec kit adapts the framemalang.com technical spec with these project-specific decisions:

- **3 fixed categories:** sosok (people), heritage (history/culture), event (events)
- **Hashtag system** instead of generic tags (`/hashtag/{slug}` not `/tag/{slug}`)
- **Indonesian URL prefixes:** `/artikel`, `/kategori`, `/penulis`, `/hashtag`
- **Zero-cost constraint:** Everything runs on free tiers (Vercel + Sanity)
- **ISR over SSR:** Static-first with on-demand webhook revalidation

---

## Milestone Summary

| # | Milestone | Tasks | Est. Effort |
|---|-----------|-------|-------------|
| M1 | Project Scaffold | 11 | 1-2 hours |
| M2 | Schema & Studio | 14 | 3-4 hours |
| M3 | Core Pages | 14 | 4-6 hours |
| M4 | ISR Wiring | 6 | 1-2 hours |
| M5 | SEO Layer | 9 | 2-3 hours |
| M6 | Design Pass | 12 | 4-6 hours |
| M7 | Launch | 11 | 1-2 hours |
| **Total** | | **49 tasks** | **16-25 hours** |

---

## Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 14+ (App Router) |
| CMS | Sanity v3 |
| Styling | Tailwind CSS v3 |
| Language | TypeScript (strict) |
| Hosting | Vercel Free |
| Package Manager | pnpm |

---

*Owner: Bob | Version: 1.0.0 | Created: 2025-03-31*
