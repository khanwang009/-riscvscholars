# RALPLAN Draft: riscvscholars.org Repositioning MVP

## Requirements Summary
- Reposition the current site from a generic RISC-V directory into a scholar-facing collaboration gateway grounded in the PRD saved at `docs/prd/riscvscholars-prd-v1.md`.
- Preserve the existing SPA foundation and route skeleton in `src/App.tsx:16-24`; do not re-platform.
- Make the site satisfy the MVP in the PRD: scholars/labs listing, institution detail, research lines, collaboration explainer, claim flow, collaboration request flow, source/correction policy, and search/filter.
- Keep phase 1 low-ops: no login, inbox, messaging, admin panel, recommendation engine, or project management layer.

## Evidence Snapshot
- The current app already has routes for the core IA in `src/App.tsx:16-24`.
- The current header only exposes `Home`, `Scholars & Labs`, `Collaboration`, and `About & Policy` in `src/components/Layout.tsx:8-13`, so IA is only partially surfaced.
- The homepage hero and featured area are already gateway-oriented but still under-specified relative to the PRD in `src/pages/Home.tsx:12-39`.
- The directory page only filters by search, country, and page mode in `src/pages/Directory.tsx:8-23`, which misses PRD filters for research area, collaboration type, claimability, and open collaboration.
- The profile schema in `src/data/institutions.ts:4-22` lacks several required PRD fields.
- Claim and collaboration request forms are static and non-submitting in `src/pages/ClaimProfile.tsx:17-60` and `src/pages/SubmitRequest.tsx:22-110`.

## RALPLAN-DR Summary

### Principles
1. Preserve the existing frontend shell and iterate in-place.
2. Put scholar-facing control and source transparency ahead of growth features.
3. Prefer structured content fields over freeform editorial prose where discovery depends on filtering.
4. Keep phase-1 operations deliberately low-touch.
5. Separate content-model work from submission-transport work so the MVP can ship before backend decisions harden.

### Decision Drivers
1. Fastest path to a credible MVP from the current Vite SPA.
2. Ability to support PRD-required filtering, claim states, and collaboration-intent display.
3. Low operational and technical complexity for a small editorial team.

### Viable Options

#### Option A: Evolve the existing Vite SPA with richer local content models and lightweight form adapters
Pros:
- Reuses current route/file structure in `src/App.tsx` and `src/pages/*`.
- Smallest diff and lowest delivery risk.
- Keeps content editable in-repo while the data model is still changing.
- Supports low-ops launch without committing to a backend too early.
Cons:
- Content updates stay code-driven.
- Real submission handling still needs a transport decision for production.
- Search/filter scale is bounded by in-memory data.

#### Option B: Re-platform now to a CMS or fullstack content system
Pros:
- Better long-term editorial workflows and submission persistence.
- Easier future admin/reporting integration.
Cons:
- Conflicts with the PRD requirement to iterate from the current site.
- Higher scope, slower first release, and materially more operational setup.
- Adds architectural decisions before the funnel has been validated.

### Recommendation
Choose **Option A** for the MVP. It matches the current codebase, keeps the product focused on discoverability and curation, and leaves room to upgrade submission storage later without reworking the information architecture twice.

## Acceptance Criteria
1. Global navigation exposes the PRD-aligned top-level destinations and makes `Scholars & Labs`, `Research Lines`, `Collaboration`, and policy/about discoverable from every page.
2. Homepage explains the platform as a cross-border academic collaboration gateway and includes clear CTAs for browsing, claiming, and submitting a request.
3. Directory supports search plus filters for country, research area, collaboration type, claim status, and whether the profile is open to collaboration requests.
4. Profile detail pages display structured basic info, research focus, representative outputs, collaboration interests, preferred collaboration types, claim status, sources, and last updated.
5. Claim flow captures institution identity, verification evidence, preferred contact path, and whether the institution accepts collaboration requests.
6. Collaboration request flow captures applicant org, type, lead, contact, research focus, capability summary, target profile, collaboration goal, desired format, evidence links, and extra notes.
7. About/policy content explains source policy, editorial policy, correction path, and what the platform does not do.
8. `Research Lines` taxonomy values and directory filter values come from the same source of truth.
9. The app still builds successfully with `npm run build`, and all changed routes render without console-breaking runtime errors.

## Implementation Steps

### 1. Align the content schema with the PRD
Files:
- `src/data/institutions.ts:1-91`
- New `src/data/researchLines.ts`
- Optional new `src/types/profile.ts`

Work:
- Replace the current `Institution` shape with a phased PRD-aligned model.
- Required in phase 1: `slug`, `institution_name`, `lab_name`, `country`, `city`, `official_website`, `summary`, `research_focus`, `representative_projects`, `collaboration_interests`, `collaboration_types`, `claim_status`, `accepts_requests`, `sources`, `last_updated`.
- Deferred after the first working pass: `representative_papers`, `open_resources`, richer contact-path nuance, and any editorial enrichment not needed for page rendering or filter logic.
- Normalize enums for `claim_status` and collaboration types so UI filtering does not depend on prose fields.
- Seed the existing three institutions with the richer structure and add a small `researchLines` dataset so the taxonomy page and directory filters can share one source.
- Explicitly remove or map away `recommended_page_mode`; it must not coexist indefinitely with `accepts_requests` and collaboration-type gating.

### 2. Rework IA and brand messaging around the collaboration gateway
Files:
- `src/components/Layout.tsx:8-69`
- `src/pages/Home.tsx:12-110`
- `src/App.tsx:16-24`

Work:
- Update the nav to expose `Research Lines` and split policy/explainer discovery more clearly.
- Keep current route paths and top-level route count stable unless a redirect strategy is introduced; `Explainers` should be treated as a navigation grouping, not a new route, for the MVP.
- Rewrite homepage hero, featured sections, and CTA labels so they explicitly communicate "archive + claim + structured collaboration request".
- Add a compact "How it works" section and a source/transparency cue above the fold or in the first scroll.

### 3. Upgrade directory discovery and filtering
Files:
- `src/pages/Directory.tsx:7-156`
- `src/components/ui.tsx:8-30`

Work:
- Add filter controls for research area, collaboration type, claim status, and open-to-requests.
- Extend search to include project keywords and summary text.
- Update list cards to show institution name, lab name, country, research focus, representative project, claim status, and collaboration openness.
- Keep filter state local to the page unless deep-linking is later required.

### 4. Rebuild profile detail pages around structured judgment
Files:
- `src/pages/ProfileDetail.tsx:6-177`

Work:
- Replace the current `recommended_page_mode` framing with PRD-required fields that answer "can I understand this profile, should I approach it, and how?"
- Add sections for summary, research focus, representative outputs, collaboration interests, preferred collaboration types, source list, editorial note, correction path, and last updated.
- Gate `Request collaboration` CTA off `accepts_requests`, not a bespoke page mode label.
- Keep `Claim this profile` visible when `claim_status` is not verified.

### 5. Make claim and collaboration request flows structurally complete
Files:
- `src/pages/ClaimProfile.tsx:4-79`
- `src/pages/SubmitRequest.tsx:4-113`
- Optional new `src/lib/forms.ts`

Work:
- Replace placeholder fields with the PRD field set.
- Convert the forms to controlled state with inline validation and explicit success/error/pending states.
- Use one explicit MVP submission contract: frontend `fetch` POST to an env-configured webhook endpoint such as `VITE_INTAKE_WEBHOOK_URL`.
- In dev or when the endpoint is absent, disable live submit and show a clear non-silent fallback message so contributors know transport is not configured.
- Keep any future adapter abstraction out of the first pass; the immediate goal is a concrete request payload shape plus one delivery mode.

### 6. Strengthen explainer and policy surfaces
Files:
- `src/pages/Collaboration.tsx:5-97`
- `src/pages/About.tsx:1-48`
- `src/pages/ResearchLines.tsx:1-30`

Work:
- Rewrite the collaboration page to mirror the PRD flow exactly: how profiles are created, how claiming works, how requests are screened, what conditions trigger introductions, and what the platform does not do.
- Expand About into an editorial/source/correction policy surface that explicitly supports the low-ops curation model.
- Turn Research Lines into a reusable taxonomy page tied to filter values rather than isolated prose blocks.

### 7. Finish with verification and rollout assets
Files:
- `README.md`
- `.env.example`

Work:
- Document any required env vars for submission transport.
- Add launch and editorial update instructions so future contributors know how to add or update profiles.
- Run build and manual route smoke checks before handoff.

## Risks and Mitigations
- Risk: The PRD assumes Next.js, but the repo is Vite React.
  Mitigation: Keep the existing SPA and adapt the plan to current files rather than honoring stale framework assumptions.
- Risk: Submission transport is unspecified.
  Mitigation: Implement a frontend adapter boundary and keep production transport as a follow-up decision.
- Risk: Hard-coded content can become hard to maintain.
  Mitigation: Normalize data structures now so a later CMS/export path maps 1:1.
- Risk: Filter complexity can create brittle UI logic.
  Mitigation: Normalize filterable fields into arrays/enums instead of deriving filters from prose.

## Verification Steps
1. `npm run build`
2. Manual route smoke check for `/`, `/directory`, `/directory/:id`, `/research-lines`, `/collaboration`, `/claim-profile`, `/submit-request`, `/about`
3. Manual filter check: each directory filter changes the result set predictably.
4. Manual empty-state check: empty results render a recovery path when no profiles match filters.
5. Manual CTA check: request CTA only appears when the profile accepts requests; claim CTA reflects claim state; closed profiles show the correct non-open messaging.
6. Manual content QA: sources and last-updated metadata render on every profile.

## ADR

### Decision
Ship the MVP by iterating the existing Vite SPA into a structured, content-first collaboration gateway with richer in-repo data models and frontend-only form handling boundaries.

### Drivers
- Existing route skeleton already matches the target IA closely.
- MVP needs structured data more urgently than backend complexity.
- The PRD emphasizes low-ops curation over full workflow automation.

### Alternatives Considered
- Re-platform to a CMS/fullstack architecture immediately.
- Keep the current schema and only rewrite copy/UI.

### Why Chosen
- Re-platforming now would delay validation of the core collaboration funnel.
- Copy-only changes would leave the PRD's filter, source, and claim-intent requirements unmet.

### Consequences
- Short-term editorial updates stay code-based.
- Submission persistence remains a follow-up integration decision.
- The team gets a more stable domain model to build on in phase 2.

### Follow-ups
- Choose a real submission transport for production.
- Decide whether profile content should remain repo-backed after the first 20-50 institutions.
- Add funnel instrumentation once live submissions exist.

## Available-Agent-Types Roster
- `explore`: fast file/symbol mapping and inventory checks
- `planner`: maintain execution sequencing against the approved plan
- `architect`: review data model and IA boundaries before structural edits
- `executor`: implement page, schema, and form changes
- `verifier`: validate build, route behavior, and acceptance criteria
- `writer`: update README/editorial contribution documentation

## Follow-up Staffing Guidance

### Ralph path
- 1 `executor` lane for schema, routing, and page implementation
- 1 `architect` checkpoint before form adapter work
- 1 `verifier` lane for build/manual acceptance proof
- Reasoning levels:
  - `executor`: high
  - `architect`: medium-high
  - `verifier`: high

### Team path
- Lane 1: `executor` for content model + directory/profile pages
- Lane 2: `executor` for homepage + layout + about/collaboration/research pages
- Lane 3: `executor` for claim/request form UX and submission adapter boundary
- Lane 4: `writer` for README and editorial contribution notes
- Lane 5: `verifier` for cross-route smoke, build proof, and acceptance mapping
- Suggested reasoning:
  - schema/profile lane: high
  - IA/content lane: medium
  - forms lane: high
  - docs lane: medium
  - verification lane: high

## Launch Hints
```text
$ralph "Implement .omx/plans/prd-riscvscholars-ralplan-20260420.md in D:\RV\-riscvscholars with verification from .omx/plans/test-spec-riscvscholars-20260420.md"

$team "Execute .omx/plans/prd-riscvscholars-ralplan-20260420.md in D:\RV\-riscvscholars; use the staffing guidance and close only after the team verification path is complete"
```

## Team Verification Path
1. Each executor lane proves its slice with file diffs plus route-level manual checks.
2. The verifier lane runs `npm run build` and a full route smoke across all public pages.
3. Ralph or the team leader performs final acceptance mapping back to the plan criteria before shutdown.
