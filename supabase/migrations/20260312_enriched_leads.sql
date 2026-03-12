-- Migration: enriched_leads table for Apollo→Supabase integration
-- Run via: supabase db push

CREATE TABLE IF NOT EXISTS enriched_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Identity
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT GENERATED ALWAYS AS (COALESCE(first_name || ' ' || last_name, first_name, last_name, email)) STORED,
  title TEXT,
  linkedin_url TEXT,
  photo_url TEXT,

  -- Organisation
  company_name TEXT,
  company_domain TEXT,
  company_size TEXT,
  industry TEXT,
  country TEXT,
  city TEXT,
  state TEXT,

  -- Apollo metadata
  apollo_person_id TEXT UNIQUE,
  apollo_org_id TEXT,
  seniority TEXT,          -- e.g. 'c_suite', 'vp', 'director'
  departments TEXT[],      -- e.g. '{operations,supply_chain}'

  -- Pipeline
  lead_score INTEGER DEFAULT 0 CHECK (lead_score BETWEEN 0 AND 100),
  tier TEXT CHECK (tier IN ('hot','warm','cold')) DEFAULT 'cold',
  status TEXT DEFAULT 'new',  -- new | contacted | replied | demo | closed
  pipeline_value NUMERIC(12,2) DEFAULT 0,
  notes TEXT,

  -- Sequence tracking
  sequence_active BOOLEAN DEFAULT FALSE,
  last_contacted_at TIMESTAMPTZ,
  emails_sent INTEGER DEFAULT 0,
  opened_last BOOLEAN DEFAULT FALSE,
  replied BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS enriched_leads_email_idx ON enriched_leads(email);
CREATE INDEX IF NOT EXISTS enriched_leads_user_id_idx ON enriched_leads(user_id);
CREATE INDEX IF NOT EXISTS enriched_leads_tier_idx ON enriched_leads(tier);
CREATE INDEX IF NOT EXISTS enriched_leads_status_idx ON enriched_leads(status);
CREATE INDEX IF NOT EXISTS enriched_leads_apollo_person_id_idx ON enriched_leads(apollo_person_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_enriched_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enriched_leads_updated_at
  BEFORE UPDATE ON enriched_leads
  FOR EACH ROW EXECUTE FUNCTION update_enriched_leads_updated_at();

-- RLS
ALTER TABLE enriched_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own leads"
  ON enriched_leads
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
