# StrainChain Marketing System

StrainChain is the **cannabis vertical** of the Authentic Economy — it fuses
two systems this repo already ships:

- **AuthiChain** for the blockchain authentication layer (COAs, seed-to-sale
  chain, on-chain pedigree)
- **QRON** for the AI-generated, brand-aligned identity art that lives on
  every cannabis package, label, and certificate

Together they form a single cannabis-native protocol at **strainchain.io**.
This directory is the single source of truth for how StrainChain presents
its demos, intake, and investor story inside the repository.

## Purpose

The StrainChain marketing layer exists to make the cannabis vertical
**self‑documenting, dispensary‑ready, and regulator‑friendly**:

- Every cannabis persona flow on the site has a matching marketing header
  that states *the problem*, *the AuthiChain + QRON solution*, and *the
  business value*.
- Every StrainChain-specific demo is tagged with `why` and `value` metadata
  in `outputs/strainchain-demo-manifest.json`, so investors, regulators, and
  dispensary partners can see exactly what a flow unlocks.
- A shared intake form captures inbound cannabis enquiries (cultivators,
  labs, dispensaries, MSOs, regulators) and routes them to the right
  persona flow.
- A persona → demo mapping table gives every stakeholder a one-glance view
  of which cannabis actors have live flows and where the code lives.

## How StrainChain combines AuthiChain + QRON

```
┌──────────────┐   anchors   ┌──────────────┐   labels    ┌──────────────┐
│  AuthiChain  │ ───────────▶│  StrainChain │ ◀────────── │     QRON     │
│  (chain /    │             │  (cannabis   │             │  (identity   │
│  contracts)  │             │   vertical)  │             │   art layer) │
└──────────────┘             └──────────────┘             └──────────────┘
       │                            │                            │
       ▼                            ▼                            ▼
 COA + seed-to-sale          METRC sync,                   Strain-specific
 ledger on Polygon /         dispensary verify,            QRONs on every
 Bitcoin Ordinal             MSO multi-state API           pack & certificate
```

Every cannabis demo walks the same loop:

1. **Cultivate** — licensed cultivator mints a StrainChain batch, linked to
   the facility&rsquo;s AuthiChain identity.
2. **Test** — the lab uploads the COA and the hash is anchored on-chain.
3. **Package** — QRON generates a strain-specific identity that ships on
   the label, bound to the AuthiChain batch record.
4. **Distribute** — every custody hand-off (cultivator → distributor →
   dispensary) is signed on-chain and reconciled with METRC.
5. **Dispense** — the budtender scans at POS to confirm licensed provenance
   and compliance.
6. **Verify** — the consumer scans the QRON with any phone and sees lab
   results, strain story, and scan-to-earn rewards in 2.1 seconds.

## Cannabis persona flows

Each persona under `app/strainchain/demos/<persona>/page.tsx` targets a
single cannabis actor with its own workflow. Use the canonical mapping in
[`demo-mapping.md`](./demo-mapping.md).

| Persona      | Who it&rsquo;s for                         |
|--------------|---------------------------------------------|
| Cultivator   | Licensed growers and craft flower producers |
| Lab          | State-licensed testing laboratories         |
| Dispensary   | Recreational and medical retail storefronts |
| Consumer     | Adult-use and medical patients              |
| Regulator    | State cannabis control boards (METRC, BCC)  |

## How to use the intake form

All inbound cannabis — dispensary partnerships, cultivator onboarding,
lab integrations, MSO pilots, regulator briefings — flows through a single
Airtable intake form. See [`intake.md`](./intake.md) for the form link and
cannabis-specific triage instructions.

Use the intake form when:

- A licensed dispensary wants a StrainChain partnership or pilot.
- A cultivator or MSO wants to onboard their SKUs with strain QRONs.
- A testing lab wants to integrate COA anchoring.
- A state regulator asks for an audit-ready briefing.
- A cannabis brand wants a custom strain QRON.

## How to write a new persona demo with a marketing header

1. Create `app/strainchain/demos/<persona>/page.tsx` following one of the
   existing persona demos (`cultivator`, `lab`, `dispensary`, `consumer`,
   `regulator`) as a template.
2. **Prepend a marketing header block** to the very top of the `page.tsx`
   file, above any `'use client'` or imports:

   ```tsx
   /**
    * Demo: StrainChain — <Persona Name>
    * Problem: <1–2 sentence cannabis-specific problem>
    * Solution: AuthiChain + QRON verifies authenticity in 2.1 seconds through the StrainChain protocol.
    * Business Value: <Persona-specific value>
    */
   ```

3. Add a matching row in [`demo-mapping.md`](./demo-mapping.md).
4. Add a matching entry with `why` and `value` fields to
   `outputs/strainchain-demo-manifest.json`.
5. Link the new persona from `app/strainchain/demos/page.tsx` (the demos
   index).

## File index

| File | Purpose |
|------|---------|
| [`README.md`](./README.md) | This file — StrainChain marketing overview |
| [`intake.md`](./intake.md) | Cannabis intake form + triage rules |
| [`demo-mapping.md`](./demo-mapping.md) | Persona → demo path mapping table |

## Related assets in this repo

- `app/strainchain/page.tsx` — StrainChain landing page
- `app/strainchain/demos/` — persona demo flows (new)
- `app/solutions/cannabis/page.tsx` — AuthiChain × StrainChain cannabis solution page
- `outputs/strainchain-economy-map.md` — tiers, QRON staking, MSO targets
- `outputs/strainchain-demo-manifest.json` — persona demos with `why`/`value`
- `outputs/storymode-demo-manifest.json` — ships the Zkittlez OG StrainChain storymode
- `supabase/migrations/20260407_strainchain_schema.sql` — StrainChain DB schema
- `public/qron/strainchain-zkittlez-qr.svg` — sample strain QRON
