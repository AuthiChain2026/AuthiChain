-- Migration: Add unique constraint on brands.user_id
-- Required for upsert on conflict in /api/brands/me and /api/brands/stake
-- One brand account per Supabase user

ALTER TABLE brands
  ADD CONSTRAINT brands_user_id_unique UNIQUE (user_id);
