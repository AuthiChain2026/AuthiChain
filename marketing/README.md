# AuthiChain Marketing System

This directory is the **single source of truth** for how AuthiChain presents
its product, demos, and investor story inside the repository. Everything here
is designed to keep engineering, marketing, sales, and investor-facing
material aligned with the live code.

## Purpose

The marketing layer exists to make the AuthiChain repo **self‑documenting,
investor‑ready, and demo‑aligned**:

- Every industry demo on the site has a matching marketing header that states
  *the problem*, *the AuthiChain solution*, and *the business value*.
- Every workflow and manifest carries `why` / `value` metadata so that any
  reader — human or agent — can understand what the automation is for and
  what it unlocks commercially.
- A simple intake form captures inbound marketing / demo / partnership
  requests and routes them to the right team.
- A demo-mapping table gives stakeholders a one-glance view of which
  industries have live demos and where the code lives.

## How demos map to industries

Each demo under `app/demos/<industry>/page.tsx` targets a single industry with
its own data, visuals, and QRON storyline. Use the full mapping in
[`demo-mapping.md`](./demo-mapping.md) as the canonical list.

Demos follow the AuthiChain storymode pattern:

1. **Register** — brand or manufacturer onboards the product.
2. **Issue** — AuthiChain mints a QRON identity + TrueMark™ seal on-chain.
3. **Move** — supply-chain / custody events are signed and recorded.
4. **Verify** — end customer (or regulator) scans and authenticates in ~2.1s.

Every demo must be runnable standalone from the `/demos` index page and must
render cleanly without external credentials.

## How to use the intake form

All inbound marketing, partnership, investor, and custom-demo requests flow
through a single Airtable intake form. See [`intake.md`](./intake.md) for the
form link and internal triage instructions.

Use the intake form when:

- A prospect asks for a custom industry demo.
- An investor requests a briefing or data room access.
- A partner wants to be featured in marketing material.
- Sales needs a tailored storymode asset generated.

## How to write a new demo with a marketing header

1. Create a new folder under `app/demos/<industry>/` and add a `page.tsx`
   following the existing demos (`pharma`, `fashion`, `luxury-watch`,
   `supply-chain`) as a template.
2. **Prepend a marketing header block** to the very top of the `page.tsx`
   file, above `'use client'`:

   ```tsx
   /**
    * Demo: <Industry Name> Authentication
    * Problem: <1–2 sentence problem statement>
    * Solution: AuthiChain verifies authenticity in 2.1 seconds using QRON identities.
    * Business Value: <Industry-specific value>
    */
   ```

3. Add a matching row in [`demo-mapping.md`](./demo-mapping.md).
4. If the demo ships a product in the storymode manifest, add a matching
   entry to `outputs/storymode-demo-manifest.json` with `why` and `value`
   fields populated.
5. Link the new demo from the `/demos` index page.

## Verticals

Some industries justify a dedicated **vertical** that fuses AuthiChain and
QRON into a single product experience. Each vertical gets its own
sub-folder under `marketing/` with its own `README.md`, `intake.md`, and
`demo-mapping.md`, plus its own persona demos under `app/<vertical>/demos/`
and its own `outputs/<vertical>-demo-manifest.json`.

| Vertical | Domain | Folder | Demos | Manifest |
|----------|--------|--------|-------|----------|
| **StrainChain** (cannabis) | [strainchain.io](https://strainchain.io) | [`marketing/strainchain/`](./strainchain/) | `app/strainchain/demos/*` | `outputs/strainchain-demo-manifest.json` |

To add a new vertical, mirror the StrainChain structure: create
`marketing/<vertical>/`, add persona demos under
`app/<vertical>/demos/<persona>/page.tsx`, and ship a matching
`outputs/<vertical>-demo-manifest.json`.

## File index

| File | Purpose |
|------|---------|
| [`README.md`](./README.md) | This file — marketing system overview |
| [`intake.md`](./intake.md) | Inbound intake form + internal triage rules |
| [`demo-mapping.md`](./demo-mapping.md) | Industry → demo path mapping table |
| [`strainchain/`](./strainchain/) | StrainChain (cannabis vertical) marketing layer |
