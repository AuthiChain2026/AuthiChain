-- ============================================================
-- AuthiChain SaaS Revenue Schema — April 19, 2026
-- Supports: Brand subscriptions, Truth Mining, $QRON economy,
--           NFT drops, scan analytics, CRM lead push
-- ============================================================

-- ── Brand Profiles ──────────────────────────────────────────
create table if not exists brands (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid references auth.users(id) on delete cascade not null,
  name          text not null,
  slug          text unique not null,
  logo_url      text,
  website       text,
  industry      text not null default 'general',
  crm_webhook   text,                              -- webhook URL for lead push
  crm_api_key   text,                              -- encrypted CRM API key
  autoflow_cfg  jsonb not null default '{
    "reward_amount": 5,
    "reward_token": "QRON",
    "story_enabled": true,
    "nft_drop_enabled": false,
    "lead_capture_fields": ["email", "wallet"],
    "priority": "standard"
  }'::jsonb,
  metadata      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_brands_owner on brands(owner_id);
create index if not exists idx_brands_slug on brands(slug);

-- ── Brand Subscriptions ─────────────────────────────────────
create type subscription_plan as enum ('starter', 'pro', 'enterprise');
create type subscription_status as enum ('active', 'past_due', 'canceled', 'trialing');

create table if not exists brand_subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  brand_id                uuid references brands(id) on delete cascade not null unique,
  plan                    subscription_plan not null default 'starter',
  status                  subscription_status not null default 'active',
  stripe_customer_id      text,
  stripe_subscription_id  text unique,
  stripe_price_id         text,
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  scan_quota              int not null default 1000,    -- monthly scan limit
  scans_used              int not null default 0,       -- resets monthly
  features                jsonb not null default '{
    "truth_mining": true,
    "autoflow_priority": "standard",
    "analytics_dashboard": true,
    "crm_webhook": false,
    "custom_nft_drops": false,
    "api_access": false,
    "white_label": false
  }'::jsonb,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists idx_brand_subs_stripe on brand_subscriptions(stripe_subscription_id);

-- ── Scans (the core event) ──────────────────────────────────
create table if not exists scans (
  id              uuid primary key default gen_random_uuid(),
  brand_id        uuid references brands(id) on delete set null,
  product_id      text,                             -- references external product catalog
  scanner_wallet  text,                             -- 0x... address of scanner
  scanner_ip      inet,
  scanner_geo     jsonb,                            -- { country, region, city, lat, lng }
  scan_type       text not null default 'verify',   -- verify | truthmine | reward
  result          text not null default 'authentic', -- authentic | suspect | unknown
  confidence      numeric(5,4) not null default 0.9500,
  agent_votes     jsonb,                            -- { guardian: 0.95, sentinel: 0.92, ... }
  latency_ms      int not null default 2100,
  chain_tx        text,                             -- polygon tx hash if on-chain event
  created_at      timestamptz not null default now()
);

create index if not exists idx_scans_brand on scans(brand_id, created_at desc);
create index if not exists idx_scans_wallet on scans(scanner_wallet, created_at desc);
create index if not exists idx_scans_created on scans(created_at desc);

-- ── Truth-Mined Leads (inbound value) ───────────────────────
create table if not exists leads (
  id              uuid primary key default gen_random_uuid(),
  scan_id         uuid references scans(id) on delete cascade not null,
  brand_id        uuid references brands(id) on delete cascade not null,
  wallet_address  text,
  email           text,
  device_info     jsonb,                            -- { ua, os, screen, lang }
  geo             jsonb,                            -- { country, region, city }
  intent_score    numeric(3,2) not null default 0.50, -- 0.00-1.00
  exported        boolean not null default false,
  exported_at     timestamptz,
  crm_push_status text default 'pending',           -- pending | pushed | failed
  created_at      timestamptz not null default now()
);

create index if not exists idx_leads_brand on leads(brand_id, created_at desc);
create index if not exists idx_leads_export on leads(brand_id, exported);

-- ── $QRON Token Rewards (outbound value) ────────────────────
create table if not exists token_rewards (
  id              uuid primary key default gen_random_uuid(),
  scan_id         uuid references scans(id) on delete cascade not null,
  wallet_address  text not null,
  amount          numeric(18,4) not null,           -- $QRON amount
  token_contract  text not null default '0x0000000000000000000000000000000000000000',
  chain_id        int not null default 137,         -- Polygon mainnet
  tx_hash         text,                             -- null until confirmed on-chain
  status          text not null default 'pending',  -- pending | submitted | confirmed | failed
  created_at      timestamptz not null default now(),
  confirmed_at    timestamptz
);

create index if not exists idx_rewards_wallet on token_rewards(wallet_address, created_at desc);
create index if not exists idx_rewards_status on token_rewards(status);

-- ── Digital Souls (AI-generated item stories) ───────────────
create table if not exists digital_souls (
  id              uuid primary key default gen_random_uuid(),
  scan_id         uuid references scans(id) on delete cascade not null,
  brand_id        uuid references brands(id) on delete set null,
  product_id      text,
  wallet_address  text not null,
  story_text      text not null,
  story_metadata  jsonb not null default '{}'::jsonb,  -- { mood, style, provenance_chain }
  nft_token_id    text,                             -- if minted as NFT
  nft_tx_hash     text,
  created_at      timestamptz not null default now()
);

create index if not exists idx_souls_wallet on digital_souls(wallet_address, created_at desc);

-- ── NFT Achievement Drops ───────────────────────────────────
create table if not exists nft_drops (
  id              uuid primary key default gen_random_uuid(),
  brand_id        uuid references brands(id) on delete set null,
  wallet_address  text not null,
  drop_type       text not null default 'achievement', -- achievement | loyalty | milestone
  trigger_event   text not null,                    -- e.g. '10_scans', 'first_verify', 'streak_7d'
  token_id        text,
  contract_addr   text,
  tx_hash         text,
  metadata_uri    text,
  status          text not null default 'pending',
  created_at      timestamptz not null default now()
);

create index if not exists idx_drops_wallet on nft_drops(wallet_address);

-- ── Pay-per-Lead Billing Events ─────────────────────────────
create table if not exists lead_billing (
  id              uuid primary key default gen_random_uuid(),
  brand_id        uuid references brands(id) on delete cascade not null,
  lead_id         uuid references leads(id) on delete cascade not null,
  amount_cents    int not null default 15,          -- $0.15 per verified lead
  stripe_invoice  text,
  status          text not null default 'pending',  -- pending | invoiced | paid
  created_at      timestamptz not null default now()
);

-- ── API Keys for Enterprise / White-Label ───────────────────
create table if not exists api_keys (
  id              uuid primary key default gen_random_uuid(),
  brand_id        uuid references brands(id) on delete cascade not null,
  key_hash        text not null,                    -- sha256 of the actual key
  key_prefix      text not null,                    -- first 8 chars for display
  label           text not null default 'default',
  scopes          text[] not null default '{read}',
  rate_limit      int not null default 100,         -- req/min
  last_used_at    timestamptz,
  expires_at      timestamptz,
  revoked         boolean not null default false,
  created_at      timestamptz not null default now()
);

create index if not exists idx_api_keys_hash on api_keys(key_hash) where not revoked;

-- ── RLS Policies ────────────────────────────────────────────
alter table brands enable row level security;
alter table brand_subscriptions enable row level security;
alter table scans enable row level security;
alter table leads enable row level security;
alter table token_rewards enable row level security;
alter table digital_souls enable row level security;
alter table nft_drops enable row level security;
alter table lead_billing enable row level security;
alter table api_keys enable row level security;

-- Brand owners can read/write their own brands
create policy brands_owner_all on brands for all using (owner_id = auth.uid());

-- Brand owners can read their subscription
create policy brand_subs_owner on brand_subscriptions for all
  using (brand_id in (select id from brands where owner_id = auth.uid()));

-- Brand owners can read their scans
create policy scans_brand_owner on scans for select
  using (brand_id in (select id from brands where owner_id = auth.uid()));

-- Wallet holders can read their own rewards
create policy rewards_wallet_owner on token_rewards for select
  using (wallet_address = current_setting('app.current_wallet', true));

-- Wallet holders can read their own digital souls
create policy souls_wallet_owner on digital_souls for select
  using (wallet_address = current_setting('app.current_wallet', true));

-- Brand owners can read their leads
create policy leads_brand_owner on leads for all
  using (brand_id in (select id from brands where owner_id = auth.uid()));

-- Brand owners can manage their API keys
create policy api_keys_brand_owner on api_keys for all
  using (brand_id in (select id from brands where owner_id = auth.uid()));

-- ── Helper Functions ────────────────────────────────────────

-- Increment scan counter (called from webhook/server action)
create or replace function increment_scan_count(p_brand_id uuid)
returns void as $$
  update brand_subscriptions
  set scans_used = scans_used + 1, updated_at = now()
  where brand_id = p_brand_id;
$$ language sql security definer;

-- Monthly scan counter reset (run via pg_cron)
create or replace function reset_monthly_scans()
returns void as $$
  update brand_subscriptions
  set scans_used = 0, updated_at = now()
  where status = 'active';
$$ language sql security definer;

-- Dashboard analytics aggregate
create or replace function get_brand_analytics(p_brand_id uuid, p_days int default 30)
returns json as $$
  select json_build_object(
    'total_scans', (select count(*) from scans where brand_id = p_brand_id and created_at > now() - (p_days || ' days')::interval),
    'total_leads', (select count(*) from leads where brand_id = p_brand_id and created_at > now() - (p_days || ' days')::interval),
    'avg_confidence', (select coalesce(avg(confidence), 0) from scans where brand_id = p_brand_id and created_at > now() - (p_days || ' days')::interval),
    'avg_latency_ms', (select coalesce(avg(latency_ms), 0) from scans where brand_id = p_brand_id and created_at > now() - (p_days || ' days')::interval),
    'tokens_distributed', (select coalesce(sum(amount), 0) from token_rewards tr join scans s on s.id = tr.scan_id where s.brand_id = p_brand_id and tr.created_at > now() - (p_days || ' days')::interval),
    'scan_by_day', (select json_agg(row_to_json(d)) from (select date_trunc('day', created_at) as day, count(*) as count from scans where brand_id = p_brand_id and created_at > now() - (p_days || ' days')::interval group by 1 order by 1) d),
    'top_products', (select json_agg(row_to_json(p)) from (select product_id, count(*) as scan_count from scans where brand_id = p_brand_id and product_id is not null and created_at > now() - (p_days || ' days')::interval group by 1 order by 2 desc limit 10) p),
    'geo_breakdown', (select json_agg(row_to_json(g)) from (select scanner_geo->>'country' as country, count(*) as count from scans where brand_id = p_brand_id and scanner_geo is not null and created_at > now() - (p_days || ' days')::interval group by 1 order by 2 desc limit 10) g)
  );
$$ language sql security definer;
