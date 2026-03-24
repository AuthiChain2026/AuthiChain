-- Migration: qron_credits table
-- Tracks per-user QRON generation credit balances purchased via Stripe one-time payments.
-- Referenced by: app/api/stripe/webhook/route.ts → handleQronCreditPurchase()

CREATE TABLE IF NOT EXISTS public.qron_credits (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance    INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One row per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_qron_credits_user_id ON public.qron_credits(user_id);

-- Row-level security
ALTER TABLE public.qron_credits ENABLE ROW LEVEL SECURITY;

-- Users can read their own balance
CREATE POLICY "Users can view own qron_credits"
  ON public.qron_credits FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role can insert / update (webhook uses service key)
-- No INSERT/UPDATE policy for anon/authenticated — the webhook handler
-- uses the Supabase service role key which bypasses RLS.

-- Keep updated_at current
CREATE OR REPLACE FUNCTION public.update_qron_credits_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_qron_credits_updated_at ON public.qron_credits;
CREATE TRIGGER trg_qron_credits_updated_at
  BEFORE UPDATE ON public.qron_credits
  FOR EACH ROW EXECUTE FUNCTION public.update_qron_credits_updated_at();

-- Convenience RPC: atomically add credits (safe for concurrent webhook calls)
CREATE OR REPLACE FUNCTION public.add_qron_credits(user_uuid UUID, amount INTEGER)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.qron_credits (user_id, balance)
  VALUES (user_uuid, amount)
  ON CONFLICT (user_id)
  DO UPDATE SET balance = qron_credits.balance + EXCLUDED.balance,
                updated_at = NOW();
END;
$$;

COMMENT ON TABLE public.qron_credits IS
  'Per-user QRON generation credit balances. Credits are granted by the Stripe webhook '
  'when a one-time pack purchase (starter/creator/studio) is completed. '
  'The balance is decremented by /api/qron/generate on each successful generation.';
