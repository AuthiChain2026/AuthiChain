-- story_videos: HeyGen cinematic origin story video records
CREATE TABLE IF NOT EXISTS story_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  heygen_video_id TEXT,
  script TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  video_url TEXT,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (product_id)
);

CREATE INDEX IF NOT EXISTS story_videos_product_id_idx ON story_videos(product_id);
CREATE INDEX IF NOT EXISTS story_videos_user_id_idx ON story_videos(user_id);
CREATE INDEX IF NOT EXISTS story_videos_status_idx ON story_videos(status);

ALTER TABLE story_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own story videos" ON story_videos
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create story videos" ON story_videos
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role full access" ON story_videos
  FOR ALL USING (auth.role() = 'service_role');

-- fee_flows: QRON token economy immutable ledger
CREATE TABLE IF NOT EXISTS fee_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id),
  product_id UUID REFERENCES products(id),
  user_id UUID REFERENCES auth.users(id),
  flow_type TEXT NOT NULL CHECK (flow_type IN ('authentication_fee', 'staking_reward', 'protocol_treasury', 'burn', 'referral', 'discount_applied')),
  gross_amount NUMERIC(20,6) DEFAULT 0,
  discount_amount NUMERIC(20,6) DEFAULT 0,
  net_amount NUMERIC(20,6) DEFAULT 0,
  staker_reward_amount NUMERIC(20,6) DEFAULT 0,
  treasury_amount NUMERIC(20,6) DEFAULT 0,
  burn_amount NUMERIC(20,6) DEFAULT 0,
  staking_tier_snapshot TEXT,
  qron_staked_snapshot NUMERIC(20,6),
  discount_rate_snapshot NUMERIC(5,4),
  tx_hash TEXT,
  block_number BIGINT,
  chain_id INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed', 'reversed')),
  metadata JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  confirmed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS fee_flows_brand_id_idx ON fee_flows(brand_id);
CREATE INDEX IF NOT EXISTS fee_flows_flow_type_idx ON fee_flows(flow_type);
CREATE INDEX IF NOT EXISTS fee_flows_status_idx ON fee_flows(status);
CREATE INDEX IF NOT EXISTS fee_flows_created_at_idx ON fee_flows(created_at DESC);
