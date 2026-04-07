# CLAUDE.md - Claude Code Project Context

## Quick Start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # ESLint
npm run typecheck  # TypeScript check
npm run validate   # build + typecheck
```

## Project: AuthiChain

Blockchain product authentication platform. Next.js 15 + Supabase + OpenAI GPT-4 Vision + Hardhat + Cloudflare Workers.

**Live:** https://authichain.com

## Critical Files

- `contracts/AuthiChainNFT.sol` — ERC-721 NFT certificate smart contract
- `hardhat.config.ts` — Blockchain network configs (VeChain, Polygon)
- `drizzle.config.ts` — Drizzle ORM database configuration
- `app/api/stripe/webhook/` — Stripe webhook handler
- `app/api/classify/` — GPT-4 Vision product classification
- `app/api/nft/mint/` — NFT minting endpoint
- `.env.example` — All required environment variables

## Conventions

- Purple/green gradient theme with dark mode (next-themes)
- Radix UI primitives + Tailwind CSS 3 + class-variance-authority
- Framer Motion for animations
- react-hook-form + zod for form validation
- Node.js 20.x required

## Database

Supabase PostgreSQL + Drizzle ORM. 10 migrations in `supabase/migrations/`.
- `npm run check:db` to validate schema

## Smart Contracts

- Solidity with OpenZeppelin ERC-721
- Compile: `npm run contract:compile`
- Deploy: `npm run contract:deploy:polygon` (or `:polygon_amoy` for testnet)
- Requires `DEPLOYER_PRIVATE_KEY` env var for deployment

## Workers

5 Cloudflare Workers in `workers/` — deployed independently via `wrangler deploy`.

## Do Not

- Expose private keys, service role keys, or Stripe secrets in client code
- Use `getSession()` (deprecated) — use `getUser()` instead
- Modify contract addresses without redeploying
- Commit real wallet private keys
