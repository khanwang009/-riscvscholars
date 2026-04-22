# Test Spec Draft: riscvscholars.org Repositioning MVP

## Scope
Validate the PRD-aligned MVP repositioning of the current Vite React app without introducing backend-only requirements.

## Test Matrix

### A. Build and type safety
1. `npm run build` succeeds.
2. `npm run lint` is either green or any pre-existing failures are isolated and documented separately from the repositioning work.

### B. Route coverage
1. `/` renders updated gateway messaging and three primary CTAs.
2. `/directory` renders the full filter set and result cards with PRD-required summary fields.
3. `/directory/:id` renders source-based structured profile data and correct CTA gating.
4. `/research-lines` renders taxonomy values that match directory filter values.
5. `/collaboration` explains the intake and curation process.
6. `/claim-profile` captures all required claim fields and shows validation feedback.
7. `/submit-request` captures all required request fields and shows validation feedback.
8. `/about` exposes source policy, editorial policy, and correction/takedown guidance.

### C. Directory behavior
1. Search matches institution, lab, research focus, and project keywords.
2. Country filter narrows results correctly.
3. Research area filter narrows results correctly.
4. Collaboration type filter narrows results correctly.
5. Claim-status filter narrows results correctly.
6. Open-to-requests filter only shows profiles with `accepts_requests = true`.
7. Clearing filters restores the full dataset.
8. Research-area and collaboration-type filter options match the taxonomy source used by the `Research Lines` page.

### D. Profile behavior
1. Each profile shows institution name, lab name, location, summary, research focus, representative outputs, collaboration interests, collaboration types, claim status, sources, and last updated.
2. Profiles that do not accept requests do not render an active collaboration CTA.
3. Profiles that are unclaimed or claim-pending still render a claim CTA.
4. Closed profiles render an explicit non-open message rather than a silent missing CTA.

### E. Form behavior
1. Required fields block empty submission.
2. Email fields reject clearly invalid formats.
3. Multi-select or checkbox collaboration preferences serialize into structured payloads.
4. Success and failure states are visible without reloading the page.
5. When no production endpoint is configured, dev-mode fallback behavior is explicit and non-silent.
6. When `VITE_INTAKE_WEBHOOK_URL` is configured, the request payload includes the expected structured keys and the POST path is invoked exactly once per submit action.

### F. Content integrity
1. Source links render and open correctly.
2. Policy copy does not claim unsupported features such as login, messaging, or automated matching.
3. Navigation labels consistently use the approved scholar/lab terminology.

## Acceptance Evidence
- Build logs
- Manual screenshots or route checklist
- A short acceptance table mapping each PRD MVP item to a route/component

## Known Baseline Issue
- Current `npm run lint` fails on `src/components/ui.tsx` because `React.*Attributes` types are referenced without a React namespace import. This is pre-existing and should be fixed or explicitly carved out during execution.
