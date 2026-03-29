# ICO DApp

A modernized ICO / token presale frontend rebuilt with:

- `Next.js 16` App Router
- `React 19`
- `TypeScript`
- `Tailwind CSS v4`

The repository also includes a separate `web3` sidecar package for Hardhat-based contract work.

## What Changed

- Replaced the old Pages Router shell with the App Router
- Converted the frontend from `js/jsx` to `ts/tsx`
- Reworked styling for Tailwind CSS v4
- Added a typed env/config layer
- Added a dashboard route for launch-readiness and presale metadata
- Converted the Hardhat config and deploy script to TypeScript
- Added a lightweight Node test suite for env/config verification

## Project Structure

```text
src/app/              Next.js App Router pages and layout
src/components/       Typed UI sections and shared components
src/lib/              Env parsing, formatting, and site config
src/tests/            Node test runner tests
docs/                 Audit and modernization plan
web3/                 Hardhat sidecar package
```

## Run The App

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run test
npm run typecheck
npm run lint
npm run build
```

## Environment

The app reads public ICO settings from [`.env.local`](./.env.local), including:

- token name / symbol / supply
- current and next sale pricing
- chain/network information
- explorer URLs
- token / ICO / owner addresses

## Web3 Sidecar

The `web3` package has its own dependencies and scripts:

```bash
cd web3
npm install
npm run typecheck
npm run compile
```

The deploy script is intentionally conservative because the current repo still needs real deployment inputs and finalized contract behavior before a safe live deployment flow can be restored.

## Planning Docs

- [Modernization Audit](./docs/MODERNIZATION_AUDIT.md)
- [Implementation Phases](./IMPLEMENTATION_PHASES.md)
- [Session Notes](./SESSION.md)
