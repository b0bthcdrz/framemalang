# Vercel Deployment Guide

## Prerequisites
- A Vercel account with access to the target team/project.
- Sanity credentials filled in project environment variables.
- Working npm registry access for dependency install.

## Recommended deployment path (Git integration)
1. Push this repository to GitHub.
2. In Vercel, click **Add New → Project**.
3. Import the GitHub repository.
4. Configure runtime settings:
   - Framework preset: **Next.js**
   - Root directory: repository root
5. Set environment variables from `.env.example`:
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_READ_TOKEN`
   - `SANITY_API_WRITE_TOKEN`
   - `SANITY_REVALIDATE_SECRET`
6. Deploy and wait for first successful build.
7. Add custom domain `framemalang.com` in Vercel project settings.
8. Update Sanity CORS + webhook target URL to your deployed domain.

## CLI deployment (optional)
```bash
pnpm dlx vercel login
pnpm dlx vercel --prod
```

## Post-deploy checks
- `/` renders homepage
- `/studio` loads Sanity Studio
- `/sitemap.xml` and `/robots.txt` are available
- Publishing in Sanity triggers `/api/revalidate`
