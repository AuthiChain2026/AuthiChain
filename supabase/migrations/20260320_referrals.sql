-- Referral system
-- Each user gets one referral code. When a referred user subscribes,
-- the referrer receives a Stripe coupon credit (10% off, 3 months).

CREATE TABLE IF NOT EXISTS referrals (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code                TEXT NOT NULL UNIQUE,          -- e.g. "REF-ABC12345"
  referred_user_id    UUID REFERENCES auth.users(id),
  referred_email      TEXT,
  status              TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'converted', 'rewarded')),
  stripe_coupon_id    TEXT,                          -- coupon applied to referrer sub
  converted_at        TIMESTAMPTZ,
  rewarded_at         TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS referrals_referrer_idx ON referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS referrals_code_idx     ON referrals(code);

-- RLS: users can see their own referrals
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "referrals_owner" ON referrals
  FOR ALL USING (auth.uid() = referrer_user_id);
