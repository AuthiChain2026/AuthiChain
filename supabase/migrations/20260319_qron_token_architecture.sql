-- Migration: QRON Token Architecture DB Schema
-- Issue #19: Adds brands staking table and fee_flows table for QRON tokenomics
-- Run via: supabase db push

-- ============================================================
-- BRANDS TABLE
-- Tracks brand accounts, QRON staking tiers, and unit cost discounts
-- ============================================================
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Brand identity
  name TEXT NOT NULL,
  domain TEXT,
  logo_url TEXT,
  industry TEXT,

  -- QRON Token staking
  staking_tier TEXT NOT NULL DEFAULT 'none'
    CHECK (staking_tier IN ('none', 'bronze', 'silver', 'gold', 'platinum')),
  qron_staked NUMERIC(20, 6) NOT NULL DEFAULT 0
    CHECK (qron_staked >= 0),
  staking_wallet_address TEXT,
  staking_locked_until TIMESTAMPTZ,

  -- Unit cost economics
  unit_cost_discount NUMERIC(5, 4) NOT NULL DEFAULT 0
    CHECK (unit_cost_discount BETWEEN 0 AND 1),
  -- Effective per-unit fee after discount
  -- base_unit_cost * (1 - unit_cost_discount)
  base_unit_cost NUMERIC(10, 6) DEFAULT 0.05,

  -- Status
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS brands_user_id_idx ON brands(user_id);
CREATE INDEX IF NOT EXISTS brands_staking_tier_idx ON brands(staking_tier);
CREATE INDEX IF NOT EXISTS brands_domain_idx ON brands(domain);

-- Staking tier thresholds (reference comment):
-- none:     0 QRON staked         — 0% discount
-- bronze:   1,000 QRON staked     — 10% discount
-- silver:   10,000 QRON staked    — 25% discount
-- gold:     100,000 QRON staked   — 40% discount
-- platinum: 1,000,000 QRON staked — 60% discount

-- Auto-compute staking_tier and unit_cost_discount from qron_staked
CREATE OR REPLACE FUNCTION compute_brand_staking_tier()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.qron_staked >= 1000000 THEN
    NEW.staking_tier := 'platinum';
    NEW.unit_cost_discount := 0.60;
  ELSIF NEW.qron_staked >= 100000 THEN
    NEW.staking_tier := 'gold';
    NEW.unit_cost_discount := 0.40;
  ELSIF NEW.qron_staked >= 10000 THEN
    NEW.staking_tier := 'silver';
    NEW.unit_cost_discount := 0.25;
  ELSIF NEW.qron_staked >= 1000 THEN
    NEW.staking_tier := 'bronze';
    NEW.unit_cost_discount := 0.10;
  ELSE
    NEW.staking_tier := 'none';
    NEW.unit_cost_discount := 0.00;
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER brands_staking_tier_trigger
  BEFORE INSERT OR UPDATE OF qron_staked ON brands
  FOR EACH ROW EXECUTE FUNCTION compute_brand_staking_tier();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_brands_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW
  WHEN (OLD.qron_staked IS NOT DISTINCT FROM NEW.qron_staked)
  EXECUTE FUNCTION update_brands_updated_at();

-- RLS
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own brand"
  ON brands FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can read verified brands"
  ON brands FOR SELECT
  USING (is_verified = TRUE AND is_active = TRUE);

-- ============================================================
-- FEE_FLOWS TABLE
-- Tracks every fee event: authentication fees, staking rewards,
-- protocol treasury splits, and burn events
-- ============================================================
CREATE TABLE IF NOT EXISTS fee_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Source context
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Fee classification
  flow_type TEXT NOT NULL
    CHECK (flow_type IN (
      'authentication_fee',   -- per-scan fee charged to brand
      'staking_reward',       -- reward distributed to QRON stakers
      'protocol_treasury',    -- portion sent to protocol treasury
      'burn',                 -- QRON tokens burned (deflationary)
      'referral',             -- referral commission
      'discount_applied'      -- discount credited due to staking tier
    )),

  -- Token amounts (QRON)
  gross_amount NUMERIC(20, 6) NOT NULL DEFAULT 0 CHECK (gross_amount >= 0),
  discount_amount NUMERIC(20, 6) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  net_amount NUMERIC(20, 6) NOT NULL DEFAULT 0 CHECK (net_amount >= 0),

  -- Distribution breakdown
  staker_reward_amount NUMERIC(20, 6) DEFAULT 0,
  treasury_amount NUMERIC(20, 6) DEFAULT 0,
  burn_amount NUMERIC(20, 6) DEFAULT 0,

  -- Staking context at time of fee
  staking_tier_snapshot TEXT,
  qron_staked_snapshot NUMERIC(20, 6),
  discount_rate_snapshot NUMERIC(5, 4),

  -- Blockchain reference (optional — for on-chain settlement)
  tx_hash TEXT,
  block_number BIGINT,
  chain_id INTEGER DEFAULT 1,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'failed', 'reversed')),

  -- Metadata
  metadata JSONB DEFAULT '{}',
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS fee_flows_brand_id_idx ON fee_flows(brand_id);
CREATE INDEX IF NOT EXISTS fee_flows_product_id_idx ON fee_flows(product_id);
CREATE INDEX IF NOT EXISTS fee_flows_user_id_idx ON fee_flows(user_id);
CREATE INDEX IF NOT EXISTS fee_flows_flow_type_idx ON fee_flows(flow_type);
CREATE INDEX IF NOT EXISTS fee_flows_status_idx ON fee_flows(status);
CREATE INDEX IF NOT EXISTS fee_flows_created_at_idx ON fee_flows(created_at DESC);

-- RLS
ALTER TABLE fee_flows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own fee flows"
  ON fee_flows FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert fee flows"
  ON fee_flows FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- COMMENTS
-- ============================================================

COMMENT ON TABLE brands IS 'Brand accounts with QRON staking tier and unit cost discount tracking';
COMMENT ON COLUMN brands.staking_tier IS 'Auto-computed tier based on qron_staked: none|bronze|silver|gold|platinum';
COMMENT ON COLUMN brands.qron_staked IS 'Total QRON tokens currently staked by the brand';
COMMENT ON COLUMN brands.unit_cost_discount IS 'Fractional discount on per-unit auth fee (0.0 to 1.0)';

COMMENT ON TABLE fee_flows IS 'Immutable ledger of all QRON fee events: charges, rewards, burns, and treasury flows';
COMMENT ON COLUMN fee_flows.flow_type IS 'Category of the fee event';
COMMENT ON COLUMN fee_flows.gross_amount IS 'Full fee before discount in QRON';
COMMENT ON COLUMN fee_flows.net_amount IS 'Fee actually charged after discount in QRON';
COMMENT ON COLUMN fee_flows.burn_amount IS 'QRON burned in this event (deflationary mechanism)';
