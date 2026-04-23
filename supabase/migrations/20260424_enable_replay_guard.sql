-- GATED — DO NOT APPLY UNTIL READY.
--
-- Adds a signature nonce table so the edge gateway can enforce
-- exactly-once delivery per signature, on top of the ±300s timestamp window
-- it already enforces. The rationale for gating: some legitimate signers
-- (retries from a PLC bridge, a Stripe webhook replayed by Stripe itself
-- after a transient failure) may re-send an identical body. Audit traffic
-- for a few days after 20260423_* goes live, confirm there are no
-- legitimate duplicates, then apply this migration and flip the Worker's
-- AE_REPLAY_GUARD_ENABLED secret to "1".
--
-- When the Worker is turned on, it should:
--   1. After signature verification, attempt INSERT INTO edge_signature_nonces
--      with the sig_b64 as PK.
--   2. If INSERT raises unique_violation → return 401 "Signature replay".
--   3. Otherwise continue with the edge_transactions insert.
-- Expired rows can be reaped with the cleanup function below (wire to
-- pg_cron every 15m once pg_cron is enabled).

CREATE TABLE IF NOT EXISTS edge_signature_nonces (
  sig_b64 TEXT PRIMARY KEY,
  key_id TEXT NOT NULL,
  seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Matches the Worker's TIMESTAMP_TOLERANCE_SECONDS (300s). Nonces older
  -- than this can be reaped without re-opening the replay window, because
  -- any request with that nonce would already be outside the timestamp
  -- tolerance and rejected on that ground.
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '10 minutes')
);

CREATE INDEX IF NOT EXISTS edge_signature_nonces_expires_idx
  ON edge_signature_nonces(expires_at);

CREATE INDEX IF NOT EXISTS edge_signature_nonces_key_id_idx
  ON edge_signature_nonces(key_id);

CREATE OR REPLACE FUNCTION prune_edge_signature_nonces()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  removed INTEGER;
BEGIN
  DELETE FROM edge_signature_nonces WHERE expires_at < NOW();
  GET DIAGNOSTICS removed = ROW_COUNT;
  RETURN removed;
END;
$$;
