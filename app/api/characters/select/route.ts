import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const body = await req.json();
  const { generation_id, asset_id } = body;

  if (!generation_id || !asset_id) {
    return NextResponse.json({ error: 'generation_id and asset_id are required' }, { status: 400 });
  }

  const { data: asset, error: assetError } = await supabase
    .from('character_assets')
    .select('*')
    .eq('id', asset_id)
    .eq('generation_id', generation_id)
    .single();

  if (assetError || !asset) {
    return NextResponse.json({ error: 'asset not found for generation' }, { status: 404 });
  }

  await supabase.from('character_assets').update({ selected: false }).eq('generation_id', generation_id);
  await supabase
    .from('character_assets')
    .update({ selected: true, selected_at: new Date().toISOString() })
    .eq('id', asset_id);

  const { error: genUpdateError } = await supabase
    .from('character_generations')
    .update({ status: 'selected', selected_asset_id: asset_id })
    .eq('id', generation_id);

  if (genUpdateError) {
    return NextResponse.json({ error: genUpdateError.message }, { status: 500 });
  }

  return NextResponse.json({
    generation_id,
    selected_asset_id: asset_id,
    status: 'selected'
  });
}
