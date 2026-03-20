import { createClient } from '@supabase/supabase-js'

/**
 * Service-role client that bypasses RLS.
 * Use only in server-side webhook/background handlers — never expose to the client.
 */
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}
