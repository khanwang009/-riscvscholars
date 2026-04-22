# Context Snapshot

## Task statement
Save the provided PRD locally and produce a concrete implementation plan for `riscvscholars.org` using the OMX `ralplan` consensus planning format.

## Desired outcome
- PRD is stored in the repository.
- A concrete, file-grounded implementation plan exists in `.omx/plans/`.
- A matching test specification exists in `.omx/plans/`.

## Known facts / evidence
- Current app is a Vite + React SPA, not Next.js. Routing is defined in `src/App.tsx`.
- Current top-level routes already roughly map to the target IA: `/directory`, `/research-lines`, `/collaboration`, `/claim-profile`, `/submit-request`, `/about`.
- Current navigation omits `Research Lines` and `Explainers`; header is defined in `src/components/Layout.tsx`.
- Institutional data is hard-coded in `src/data/institutions.ts` and lacks several PRD-required fields such as `city`, `official_website`, `summary`, `collaboration_types`, `accepts_requests`, and `last_updated`.
- Directory filtering currently supports search, country, and page-mode only. It does not support research area, collaboration type, or open/claimable filters.
- Claim and collaboration request pages are static local forms without schema-driven validation or submission handling.

## Constraints
- Base implementation should iterate on the existing site rather than re-platforming.
- No new dependency should be introduced unless clearly justified.
- MVP remains low-ops: no login, messaging, recommendation engine, or complex admin.
- Plan should reflect current codebase reality instead of the PRD's outdated Next.js assumption.

## Unknowns / open questions
- What backend/form delivery path should be used for claim and collaboration submissions in phase 2.
- Whether institution data will remain file-backed in the short term or move to a CMS/DB in phase 2.
- Which analytics or observability path will be used to track funnel metrics.

## Likely codebase touchpoints
- `src/App.tsx`
- `src/components/Layout.tsx`
- `src/data/institutions.ts`
- `src/pages/Home.tsx`
- `src/pages/Directory.tsx`
- `src/pages/ProfileDetail.tsx`
- `src/pages/Collaboration.tsx`
- `src/pages/ClaimProfile.tsx`
- `src/pages/SubmitRequest.tsx`
- `src/pages/About.tsx`
- `src/pages/ResearchLines.tsx`
