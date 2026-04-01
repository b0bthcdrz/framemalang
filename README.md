# framemalang.com

Next.js + Sanity implementation for the Frame Malang hyperlocal media platform.

## Stack
- Next.js (App Router, TypeScript)
- Sanity v3 (embedded Studio at `/studio`)
- Tailwind CSS
- ISR + revalidation endpoint at `/api/revalidate`

## Quick start
1. Copy env template:
   ```bash
   cp .env.example .env.local
   ```
2. Fill Sanity credentials in `.env.local`.
3. Install and run:
   ```bash
   pnpm install
   pnpm dev
   ```

## Routes
- `/` homepage
- `/artikel` article index
- `/artikel/[slug]` article detail
- `/kategori/[slug]` category listing
- `/penulis/[slug]` author profile
- `/hashtag/[slug]` hashtag listing
- `/studio` embedded Sanity Studio
- `/api/revalidate` webhook endpoint


## Deployment
See `DEPLOYMENT.md` for Git-based and CLI deployment steps to Vercel.
