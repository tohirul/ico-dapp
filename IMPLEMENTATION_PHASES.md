# Implementation Phases: ICO DApp Modernization

**Project Type**: Marketing site + dashboard shell + Web3 sidecar
**Target Stack**: Next.js App Router + React 19 + TypeScript + Tailwind CSS v4
**Estimated Total**: 8-12 hours

---

## Phase 1: Typed Foundation
**Type**: Infrastructure
**Estimated**: 2 hours
**Files**: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `app/layout.tsx`, `app/globals.css`

**Tasks**:
- [ ] Upgrade project dependencies to latest stable Next.js / React / Tailwind v4 stack
- [ ] Replace `jsconfig.json` with strict TypeScript config
- [ ] Remove Pages Router bootstrap and create App Router layout
- [ ] Rework global styling for Tailwind v4
- [ ] Add typed metadata and base layout shell

**Verification Criteria**:
- [ ] `npm install` completes successfully
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] App boots through the App Router

**Exit Criteria**: The repo has a working typed App Router foundation and no legacy Pages Router dependency in the main app flow.

---

## Phase 2: Home Page Rebuild
**Type**: UI
**Estimated**: 3 hours
**Files**: `app/page.tsx`, `components/home/*.tsx`, `lib/site-config.ts`, `lib/env.ts`, `public/*`

**Tasks**:
- [ ] Build a complete landing page using typed section data
- [ ] Preserve token/env-driven messaging from the existing project
- [ ] Reuse existing branding assets and token imagery
- [ ] Replace placeholder homepage components with real TSX sections

**Verification Criteria**:
- [ ] Home page renders without client runtime errors
- [ ] Token stats and CTAs derive from env/config
- [ ] Layout is responsive on mobile and desktop
- [ ] No placeholder sections remain in the homepage path

**Exit Criteria**: The root route presents a modern ICO landing page with real content and typed structure.

---

## Phase 3: Dashboard And Wallet Shell
**Type**: Integration
**Estimated**: 2 hours
**Files**: `app/dashboard/page.tsx`, `app/providers.tsx`, `providers/*.ts`, `components/shared/*.tsx`

**Tasks**:
- [ ] Reintroduce a typed provider layer for client-side wallet/query state
- [ ] Build a dashboard shell with roadmap, sale metrics, and contract metadata
- [ ] Centralize chain/config handling
- [ ] Keep Web3-specific logic isolated to client-safe modules

**Verification Criteria**:
- [ ] `/dashboard` route renders correctly
- [ ] Client providers mount without hydration issues
- [ ] Wallet shell compiles in App Router
- [ ] Typed config is reused across the app

**Exit Criteria**: The app includes a typed dashboard route and a modern provider boundary for future DApp features.

---

## Phase 4: JS To TS Cleanup
**Type**: Infrastructure
**Estimated**: 2 hours
**Files**: `components/**/*.tsx`, `providers/**/*.ts`, `web3/**/*.ts`, cleanup of legacy `.js/.jsx`

**Tasks**:
- [ ] Convert all frontend `.js/.jsx` files to `.ts/.tsx`
- [ ] Convert `web3` config/scripts from JS to TS where practical
- [ ] Remove dead placeholder modules and unused legacy files
- [ ] Normalize imports to typed module boundaries

**Verification Criteria**:
- [ ] No frontend `.js/.jsx` source remains
- [ ] Web3 sidecar compiles with its updated config
- [ ] No orphaned legacy imports remain

**Exit Criteria**: The codebase is consistently typed and no longer depends on legacy JS entrypoints.

---

## Phase 5: Verification And Hand-off
**Type**: Testing
**Estimated**: 1-3 hours
**Files**: `package.json`, `tests/**/*`, documentation files

**Tasks**:
- [ ] Add a lightweight test setup for core helpers/config
- [ ] Run lint, typecheck, tests, and production build
- [ ] Document any remaining env or contract gaps
- [ ] Update README for the new stack and run commands

**Verification Criteria**:
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run test` passes
- [ ] `npm run build` passes

**Exit Criteria**: The migration is verified end-to-end and documented for future work.

---

## Notes

**Testing Strategy**: Unit tests for env/config helpers plus build/type/lint verification for the application shell  
**Deployment Strategy**: Validate locally first, then adapt for the desired hosting target  
**Context Management**: The work is intentionally split into phases so the rebuild can be resumed safely if needed
