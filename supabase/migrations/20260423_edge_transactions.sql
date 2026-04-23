-- edge_transactions: target table for the Authentic Economy edge gateway.
-- Each row captures one Ed25519-signed event received by workers/edge-gateway.
-- See workers/edge-gateway/HEADERS.md for the signing contract.

CREATE TABLE IF NOT EXISTS edge_transactions (
  id BIGSERIAL PRIMARY KEY,
  source_system TEXT NOT NULL DEFAULT 'unknown',
  transaction_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS edge_transactions_source_idx
  ON edge_transactions(source_system);

CREATE INDEX IF NOT EXISTS edge_transactions_processed_idx
  ON edge_transactions(processed_at DESC);

-- Follow-up (tracked in plan): promote key_id and body_sha256 out of the
-- transaction_data JSONB blob into first-class columns once query patterns
-- stabilize. For now they live at transaction_data.meta.{key_id,body_sha256}.
