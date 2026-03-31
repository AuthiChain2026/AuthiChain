import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getProduct(product_id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', product_id)
    .single();
  if (error) throw error;
  return data;
}

export async function getVerificationEvents(product_id: string) {
  const { data, error } = await supabase
    .from('verification_events')
    .select('*')
    .eq('product_id', product_id)
    .order('timestamp', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getQronMetadata(qron_id: string | null) {
  if (!qron_id) return null;
  const { data, error } = await supabase
    .from('qron_metadata')
    .select('*')
    .eq('id', qron_id)
    .single();
  if (error) throw error;
  return data;
}
