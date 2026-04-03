# AGENTS.md - Development Guide for AI Assistants

## Project Overview

AuthiChain is a blockchain product authentication platform combining AI-powered classification (GPT-4 Vision) with blockchain verification. Products get TrueMark IDs, on-chain NFT certificates, and can be verified publicly.

**Live:** https://authichain.com

## Key Principles

- Keep diffs scoped to the requested feature; avoid unrelated refactors.
- Never commit secrets or real credentials; use environment variables and `.env.example`.
- Run `npm run lint` and `npm run build` before finishing any app changes.
- For UI changes, keep accessibility and mobile responsiveness intact.
- Purple/green gradient theme with dark mode support (next-themes).

## Architecture

### Frontend (Next.js 15 App Router)

- Server components by default; `"use client"` only for interactive elements.
- UI built with Radix UI primitives + Tailwind CSS 3 + class-variance-authority.
- Animations via Framer Motion.
- Forms use react-hook-form + zod validation.

### Authentication (Supabase)

- SSR auth via `@supabase/ssr` middleware pattern.
- Server-side: `createClient()` from Supabase server utils.
- Client-side: `createBrowserClient()`.

### Database (Supabase + Drizzle ORM)

- 10 migration files in `supabase/migrations/`.
- Tables: products, certifications, subscriptions, leads, referrals, brands, supply chain, QRON credits.
- Drizzle ORM configured via `drizzle.config.ts` for type-safe queries.
- Direct PostgreSQL via `pg` package also available.

### Blockchain / Smart Contracts

- `contracts/AuthiChainNFT.sol` — ERC-721 NFT certificate contract (OpenZeppelin).
- Hardhat for compilation and deployment.
- Target networks: VeChain (MainNet/TestNet), Polygon (Mainnet/Amoy testnet).
- Deploy: `npm run contract:deploy:polygon` or `contract:deploy:testnet`.

### AI Classification

- OpenAI GPT-4 Vision API for product image classification.
- Fal.ai for generating AI artwork for NFT certificates.

### Payments (Stripe)

- Subscription plans: Starter ($299/mo) and Pro ($799/mo), with annual discounts.
- Webhook at `/api/stripe/webhook`.
- Price IDs configured via `NEXT_PUBLIC_STRIPE_PRICE_*` env vars.

### Cloudflare Workers

5 workers in `workers/`:
- `license-issuer` — License key generation/validation
- `qron-provenance` — QRON provenance chain verification
- `scan-validate` — QR scan validation
- `telegram` — Telegram bot integration
- `verify-worker` — Product verification endpoint

### Integrations

- **Airtable** — CRM/lead management
- **Make.com** — Welcome email automation webhook
- **Thirdweb** — NFT minting SDK (Base / Base Sepolia)
- **Resend** — Transactional email

## Common Tasks

### Adding a new API route

1. Create `app/api/<route>/route.ts`.
2. For authenticated routes: use Supabase server client + `getUser()`.
3. Return `NextResponse.json()`.

### Deploying a smart contract

```bash
# Compile
npm run contract:compile

# Deploy to testnet
DEPLOYER_PRIVATE_KEY=... npm run contract:deploy:polygon_amoy

# Deploy to mainnet
DEPLOYER_PRIVATE_KEY=... npm run contract:deploy:polygon
```

### Adding a new Worker

1. Create directory under `workers/<name>/`.
2. Add `wrangler.toml` with bindings.
3. Deploy via `wrangler deploy`.

## File Structure Quick Reference

- `app/` — Next.js pages and API routes (30+ routes)
- `components/` — Radix UI-based React components
- `contracts/` — Solidity smart contracts
- `lib/` — Shared utilities
- `hooks/` — React custom hooks
- `server/` — Server-side logic
- `workers/` — Cloudflare Workers (5 workers)
- `supabase/migrations/` — Database schema (10 migrations)
- `scripts/` — Deployment and utility scripts
- `hardhat.config.ts` — Blockchain network configuration
- `drizzle.config.ts` — ORM database configuration
