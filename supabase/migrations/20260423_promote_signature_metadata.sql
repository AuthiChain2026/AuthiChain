-- Promote key_id and body_sha256 out of the transaction_data JSONB blob into
-- first-class columns on edge_transactions. Keeps the JSONB copy for backward
-- compatibility so older rows (if any) stay queryable without a join.
--
-- Safe to run after 20260423_edge_transactions.sql. Idempotent.

ALTER TABLE edge_transactions
  ADD COLUMN IF NOT EXISTS key_id TEXT,
  ADD COLUMN IF NOT EXISTS body_sha256 TEXT;

-- Backfill from the JSONB meta block for any rows written before this change.
UPDATE edge_transactions
SET key_id = COALESCE(key_id, transaction_data -> 'meta' ->> 'key_id'),
    body_sha256 = COALESCE(body_sha256, transaction_data -> 'meta' ->> 'body_sha256')
WHERE key_id IS NULL
   OR body_sha256 IS NULL;

CREATE INDEX IF NOT EXISTS edge_transactions_key_id_idx
  ON edge_transactions(key_id);

CREATE INDEX IF NOT EXISTS edge_transactions_body_sha256_idx
  ON edge_transactions(body_sha256);
