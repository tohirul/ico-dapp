# Modernization Audit

**Date**: 2026-03-29
**Goal**: Convert the project into a modern `Next.js` App Router application using the latest stable `TypeScript`, `React`, and `Tailwind CSS v4`, while preserving the ICO/Web3 product intent.

## Current State

The repository is not currently in a production-ready state. It looks more like a partially copied starter than a working app:

- The workspace is **not a Git repository**, which removes normal change-tracking and rollback safety.
- `package.json` is pinned to **Next 13.2.4**, **React 18.2.0**, and **Tailwind CSS 3.x**.
- The app still uses the **Pages Router** and explicitly disables App Router support in [`next.config.js`](../next.config.js).
- The root pages in [`pages/index.js`](../pages/index.js) and [`pages/dashboard.js`](../pages/dashboard.js) are placeholders and do not render the main component library.
- Most files under [`components`](../components) are 7-line placeholders.
- Several core files are empty:
  - [`provider/wagmiConfigs.js`](../provider/wagmiConfigs.js)
  - [`provider/hooks.js`](../provider/hooks.js)
  - [`context/Web3Provider.js`](../context/Web3Provider.js)
  - [`context/ToastContext.js`](../context/ToastContext.js)
  - [`context/Utility.js`](../context/Utility.js)
- The largest real UI file, [`components/HomePage/Header.jsx`](../components/HomePage/Header.jsx), references `isDarkMode` without defining it, so it would not compile as-is.
- `next build` is currently configured for static export via `"next build && next export"` and `trailingSlash: true`, which is not the right default for a modern App Router DApp shell.
- No dependencies are installed in this workspace at the moment.

## Audit Findings

### 1. Architecture Debt

- The project mixes a landing-page marketing surface, a DApp dashboard, and a Hardhat sidecar without a clear boundary.
- The frontend contains almost no real routed feature composition.
- The current import/export barrel files add indirection but do not provide actual module structure.

### 2. Frontend Debt

- The frontend is JS/JSX-only and uses a permissive `jsconfig.json` with `allowJs: true` and `strict: false`.
- Tailwind is still configured with the v3 config-file approach.
- The current UI surface is largely disconnected from routing.
- There is no typed env contract, no typed content model, and no modern layout foundation.

### 3. Web3 Debt

- Frontend Web3 provider/context layers are empty.
- The smart-contract sidecar exists, but the deployment script is empty.
- The repo communicates DApp functionality, but the working code does not currently deliver it.

### 4. Operational Debt

- No test setup is present.
- No local lockfile is present.
- No source control metadata exists in the workspace.

## Recommended Migration Strategy

This should be treated as a **structured rebuild**, not a fragile in-place upgrade.

### Preserve

- Branding assets in [`public`](../public)
- Smart contracts in [`web3/contracts`](../web3/contracts)
- Public env contract from [`.env.local`](../.env.local)
- Product direction: ICO / token presale / analytics dashboard / wallet-enabled flow

### Replace

- Pages Router with App Router
- JS/JSX source with TS/TSX
- Tailwind v3 config with Tailwind v4 CSS-first setup
- Broken placeholder pages with a coherent landing page and dashboard shell
- Relaxed config with strict typed project settings

## Success Criteria

- App runs on latest stable Next.js App Router with TypeScript
- Tailwind CSS v4 is configured correctly
- No `.js` / `.jsx` source remains in the frontend application surface
- The dashboard route exists under App Router
- Env usage is centralized and typed
- Frontend build, typecheck, lint, and tests run cleanly

## Assumptions

- The immediate priority is a **modernized foundation** rather than restoring every missing legacy feature.
- The `web3` folder remains a sidecar package, but its JS config/scripts should also be converted to TypeScript where practical.
- Wallet integration can be reintroduced as a typed shell even if contract deployment details remain environment-driven.
