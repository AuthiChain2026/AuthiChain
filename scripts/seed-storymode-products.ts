/**
 * Seed script: insert test products + supply chain events for all 10 industries.
 *
 * Run with:
 *   npx tsx scripts/seed-storymode-products.ts
 *
 * Requires: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!,
)

interface Product {
  id: string; name: string; description: string; sku: string; price: number
  currency: string; category: string; brand: string; industry_id: string
  truemark_id: string; blockchain_tx_hash: string
}

interface Event {
  product_id: string; event_type: string; location: string
  actor_name: string; description: string; timestamp: string
}

const products: Product[] = [
  {
    id: 'a1000001-0001-4000-a000-000000000001',
    name: 'Valentino Garavani Rockstud Pump',
    description: 'Hand-stitched Italian leather pump with signature platinum-finish pyramid studs.',
    sku: 'VAL-RS-2026-BK38', price: 1190, currency: 'USD',
    category: 'Fashion & Apparel', brand: 'Valentino',
    industry_id: '9b66a9ea-54f9-4f6c-86aa-c8c0220aa9da',
    truemark_id: 'TM-VAL-RS2026-A7K92',
    blockchain_tx_hash: '0xf8a91bc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
  },
  {
    id: 'a1000001-0001-4000-a000-000000000002',
    name: 'Patek Philippe Nautilus 5711/1A',
    description: 'Self-winding mechanical movement with 315 components. Blue-black gradient dial.',
    sku: 'PP-NAU-5711-BLU', price: 85000, currency: 'USD',
    category: 'Luxury Goods', brand: 'Patek Philippe',
    industry_id: 'aad9e1d6-c677-48f8-ab1e-c2479a6c585f',
    truemark_id: 'TM-PP-NAU5711-X3M47',
    blockchain_tx_hash: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0b2',
  },
  {
    id: 'a1000001-0001-4000-a000-000000000003',
    name: 'Kopi Luwak Heritage Reserve Coffee',
    description: 'Single-origin wild civet coffee from the highlands of Sumatra.',
    sku: 'KL-HR-2026-SUM', price: 289, currency: 'USD',
    category: 'Food & Beverage', brand: 'Heritage Reserve',
    industry_id: '6230622d-7d28-4165-8b69-0ef8c2d712df',
    truemark_id: 'TM-KL-HR2026-Q9P55',
    blockchain_tx_hash: '0xb3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3',
  },
  {
    id: 'a1000001-0001-4000-a000-000000000004',
    name: 'Sony WH-1000XM6 Wireless Headphones',
    description: 'Flagship noise-cancelling headphones with 40mm carbon-fiber drivers.',
    sku: 'SNY-XM6-BLK', price: 449, currency: 'USD',
    category: 'Electronics', brand: 'Sony',
    industry_id: '83a68302-fcce-497b-bbde-a5be7d7f7299',
    truemark_id: 'TM-SNY-XM6-W2R88',
    blockchain_tx_hash: '0xc4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4',
  },
  {
    id: 'a1000001-0001-4000-a000-000000000005',
    name: 'NovaShield mRNA Booster Vial',
    description: 'Next-generation mRNA booster vaccine. FDA-approved, cold-chain tracked.',
    sku: 'NVS-MRNA-B7-2026', price: 42, currency: 'USD',
    category: 'Pharmaceuticals', brand: 'NovaShield Bio',
    industry_id: '3ab1ab2c-b0b2-42f3-8580-1861a8a556ac',
    truemark_id: 'TM-NVS-B7-L4H21',
    blockchain_tx_hash: '0xd5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5',
  },
  {
    id: 'a1000001-0001-4000-a000-000000000006',
    name: 'Banksy "Girl with Balloon" Authenticated Print',
    description: 'Signed screen print on paper, edition 42/150.',
    sku: 'BNK-GWB-150-042', price: 320000, currency: 'USD',
    category: 'Art & Collectibles', brand: 'Banksy / Pest Control',
    industry_id: '3ed25396-48f9-4eb3-bf0a-a26ca98814f6',
    truemark_id: 'TM-BNK-GWB-N8V33',
    blockchain_tx_hash: '0xe6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6',
  },
  {
    id: 'a1000001-0001-4000-a000-000000000007',
    name: 'La Mer Creme de la Mer Moisturizer',
    description: 'The legendary Miracle Broth moisturizer. Hand-harvested sea kelp.',
    sku: 'LMR-CDM-60ML', price: 380, currency: 'USD',
    category: 'Cosmetics & Beauty', brand: 'La Mer',
    industry_id: '55bde19e-cf86-4013-896f-72320ae5852b',
    truemark_id: 'TM-LMR-CDM-P6T19',
    blockchain_tx_hash: '0xf7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7',
  },
  {
    id: 'a1000001-0001-4000-a000-000000000008',
    name: 'Brembo GT-R Brake Caliper Set',
    description: 'Forged aluminum 6-piston calipers for Porsche 911 GT3.',
    sku: 'BRM-GTR-6P-911', price: 4800, currency: 'USD',
    category: 'Automotive', brand: 'Brembo',
    industry_id: '920c1608-5a93-485f-87c1-480386b020c3',
    truemark_id: 'TM-BRM-GTR-K7J44',
    blockchain_tx_hash: '0xa8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8',
  },
  {
    id: 'a1000001-0001-4000-a000-000000000009',
    name: 'Titleist Pro V1x Limited Tour Edition Golf Ball (Dozen)',
    description: 'Tour-exclusive urethane-cover golf ball. Laser-serialized.',
    sku: 'TTL-PV1X-LTE-DZ', price: 79.99, currency: 'USD',
    category: 'Sports & Fitness', brand: 'Titleist',
    industry_id: 'd274fd86-0444-4570-a5e3-e5f7a09d4d2c',
    truemark_id: 'TM-TTL-PV1X-S5Q77',
    blockchain_tx_hash: '0xb9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9',
  },
  {
    id: 'a1000001-0001-4000-a000-000000000010',
    name: 'SKF Explorer Spherical Roller Bearing 22320',
    description: 'Self-aligning bearing for extreme load applications. Swedish steel.',
    sku: 'SKF-22320-EXP', price: 1250, currency: 'USD',
    category: 'Industrial', brand: 'SKF',
    industry_id: 'c081d03e-0216-4062-9613-ea3055ac02b7',
    truemark_id: 'TM-SKF-22320-R3F66',
    blockchain_tx_hash: '0xc0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0',
  },
]

async function main() {
  console.log('Seeding', products.length, 'StoryMode test products...')

  for (const p of products) {
    const { error } = await supabase.from('products').upsert({
      ...p,
      is_active: true,
      is_registered: true,
      supply_chain_enabled: true,
      authenticity_score: 96 + Math.random() * 4,
      nft_contract_address: '0xc3143254997d48fdc9983d618fb2e10067673eb5',
    }, { onConflict: 'id' })

    if (error) console.error(`  ✗ ${p.name}:`, error.message)
    else console.log(`  ✓ ${p.name}`)
  }

  console.log('\nDone. Products ready for /storymode/viewer?product_id=<id>')
}

main()
