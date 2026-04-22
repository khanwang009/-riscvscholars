# riscvscholars.org

`riscvscholars.org` is a source-based collaboration gateway for overseas RISC-V institutions and Chinese laboratories. The current MVP focuses on:

- Structured institution profiles
- Shared research-line taxonomy
- Claim/correction intake for institutional stewards
- Collaboration request intake for Chinese labs

## Local development

Prerequisites:

- Node.js 24+
- npm 11+

Run locally:

1. Install dependencies with `npm install`
2. Copy `.env.example` to `.env.local`
3. Optional: set `VITE_INTAKE_WEBHOOK_URL` if you want the claim/request forms to POST to a live endpoint
4. Start the dev server with `npm run dev`

Build for production:

- `npm run build`

Type-check:

- `npm run lint`

## Environment variables

- `VITE_INTAKE_WEBHOOK_URL`: optional webhook endpoint for claim and collaboration request submission
- `VITE_ADMIN_API_URL`: optional base URL for the admin APIs
- `GEMINI_API_KEY`: legacy AI Studio environment variable retained for compatibility with the original scaffold
- `APP_URL`: optional deployment URL placeholder from the original scaffold
- `PORT`: backend port for the intake API
- `STORAGE_DIR`: backend directory for persisted intake records
- `SQLITE_PATH`: SQLite database file used for intake storage
- `ADMIN_API_TOKEN`: bearer token required for management query/export APIs

## Content editing

The current MVP is intentionally repo-backed and low-ops.

- Institution profiles live in `src/data/institutions.ts`
- Shared taxonomy lives in `src/data/researchLines.ts`
- Policy and explainer copy lives in `src/pages/`

When adding a new profile, keep it source-based and include:

- institution/lab identity
- location
- summary and research focus
- representative projects
- collaboration interests and collaboration types
- claim status
- whether the profile accepts requests
- sources and last updated

## Backend API

The repo now includes a minimal intake backend:

- `GET /health`
- `POST /api/intake`
- `GET /api/admin/submissions`
- `GET /api/admin/submissions/:id`
- `PATCH /api/admin/submissions/:id/review-status`
- `GET /api/admin/submissions-export?format=csv`

The frontend also includes a minimal admin page at `/admin`:

- paste a bearer token for the admin APIs
- review list and detail data
- update review status
- export the current filtered set as CSV or JSON

## Institution scraping and ingestion

The repo now includes a first-pass public-web enrichment pipeline for institution profiles.

Seed list:

- `scripts/institution-seeds.json`

Canonical published data:

- `src/data/institutions.json`

Generated runtime artifacts:

- `runtime-data/institution-scrape-report.json`
- `runtime-data/institution-drafts.json`
- `runtime-data/institution-ingest-preview.json`

Commands:

- `npm run scrape:institutions`
- `npm run ingest:institutions`
- `npm run ingest:institutions -- --append-candidates`
- `npm run ingest:institutions -- --append-candidates --apply`

Workflow:

1. Update or expand `scripts/institution-seeds.json`
2. Run `npm run scrape:institutions` to fetch public evidence and draft candidates
3. Inspect `runtime-data/institution-drafts.json`
4. Run `npm run ingest:institutions -- --append-candidates` to preview safe merges
5. Review `runtime-data/institution-ingest-preview.json`
6. Only then run with `--apply` to update `src/data/institutions.json`

Important:

- The first version is conservative. It is meant to collect candidate facts, not replace editorial judgment.
- Collaboration intent, claim status, and editorial notes should remain human-maintained.

Run locally:

- `npm run dev:server`

Build backend:

- `npm run build:server`

Admin API usage:

- send `Authorization: Bearer <ADMIN_API_TOKEN>`
- use `type`, `reviewStatus`, `search`, `limit`, and `offset` on `/api/admin/submissions`
- use `format=csv` or `format=json` on `/api/admin/submissions-export`

## Tencent Cloud deployment

Deployment assets for a standalone stack live in `deploy/tencent-cloud/`.

- web route: `/riscvscholars/`
- api route: `/riscvscholars-api/`
- local container ports: `127.0.0.1:15080` and `127.0.0.1:15000`
