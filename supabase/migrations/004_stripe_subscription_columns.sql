-- Migration 004: Add Stripe subscription columns to profiles table
-- Run this in Supabase SQL Editor or via supabase db push

-- Add Stripe columns to profiles (users)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_status TEXT NOT NULL DEFAULT 'inactive',
  ADD COLUMN IF NOT EXISTS subscription_period_end TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS subscription_updated_at TIMESTAMPTZ DEFAULT NOW();

-- Index for fast webhook lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id
  ON public.profiles (stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_stripe_subscription_id
  ON public.profiles (stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;

-- Sales funnel events table for CRM analytics
CREATE TABLE IF NOT EXISTS public.sales_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  event TEXT NOT NULL,       -- pricing_viewed, checkout_started, checkout_completed, checkout_abandoned, demo_requested
  plan TEXT,                 -- starter, pro, enterprise
  interval TEXT,             -- monthly, annual
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for sales_events (service role writes, owner reads)
ALTER TABLE public.sales_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sales events"
  ON public.sales_events FOR SELECT
  USING (auth.uid() = user_id);

-- Allow anonymous inserts (visitor tracking before login)
CREATE POLICY "Anyone can insert sales events"
  ON public.sales_events FOR INSERT
  WITH CHECK (true);

-- Comment
COMMENT ON TABLE public.sales_events IS 'CRM funnel analytics: tracks pricing page views, checkout starts, conversions, and abandonment.';
