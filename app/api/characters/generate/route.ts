import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { buildOpenArtPrompt } from '@/packages/characters/src/prompt';
import { OpenArtClient } from '@/packages/openart/src/client';

function scoreVariant(index: number) {
  const seeded = [
    { protocol: 9.2, thumb: 8.8, premium: 9.1, silhouette: 9.0, trust: 9.4, mint: 9.0, ui: 8.9 },
    { protocol: 8.7, thumb: 9.1, premium: 8.8, silhouette: 9.3, trust: 8.9, mint: 8.6, ui: 9.2 },
    { protocol: 8.9, thumb: 8.5, premium: 9.4, silhouette: 8.6, trust: 9.0, mint: 9.3, ui: 8.7 },
    { protocol: 8.4, thumb: 8.9, premium: 8.7, silhouette: 8.8, trust: 8.8, mint: 8.5, ui: 9.0 }
  ];
  return seeded[index] ?? seeded[0];
}

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const body = await req.json();
  const { tenant_id, user_id, object_id, archetype, colorway, mood, object_context, brand_context, style } = body;

  if (!archetype) {
    return NextResponse.json({ error: 'archetype is required' }, { status: 400 });
  }

  const { prompt, negativePrompt } = buildOpenArtPrompt({
    archetype,
    colorway,
    mood,
    objectContext: object_context,
    brandContext: brand_context,
    style
  });

  const { data: generation, error: genError } = await supabase
    .from('character_generations')
    .insert({
      tenant_id,
      user_id,
      object_id,
      archetype,
      style: style ?? 'premium futuristic heraldic concept art',
      colorway,
      mood,
      prompt,
      negative_prompt: negativePrompt,
      provider: 'openart',
      provider_model: process.env.OPENART_MODEL ?? 'openart-default',
      status: 'pending',
      variant_count: 4,
      request_payload: body
    })
    .select('*')
    .single();

  if (genError || !generation) {
    return NextResponse.json({ error: genError?.message ?? 'failed to create generation' }, { status: 500 });
  }

  try {
    const client = new OpenArtClient(process.env.OPENART_API_KEY!, process.env.OPENART_BASE_URL);
    const generated = await client.generate({
      prompt,
      negativePrompt,
      numImages: 4,
      size: '1024x1536',
      transparentBackground: false,
      model: process.env.OPENART_MODEL
    });

    const assetsPayload = generated.assets.map((asset, index) => {
      const s = scoreVariant(index);
      return {
        generation_id: generation.id,
        tenant_id,
        user_id,
        provider_asset_id: asset.id,
        image_url: asset.imageUrl,
        preview_url: asset.previewUrl,
        prompt,
        metadata: asset.metadata ?? {},
        protocol_fit_score: s.protocol,
        thumbnail_clarity_score: s.thumb,
        premium_feel_score: s.premium,
        silhouette_score: s.silhouette,
        trust_symbolism_score: s.trust,
        mint_readiness_score: s.mint,
        ui_compatibility_score: s.ui
      };
    });

    const { data: insertedAssets, error: assetError } = await supabase
      .from('character_assets')
      .insert(assetsPayload)
      .select('*');

    if (assetError || !insertedAssets) throw assetError ?? new Error('asset insert failed');

    const recommended = [...insertedAssets].sort((a, b) => Number(b.total_score) - Number(a.total_score))[0];

    await supabase.from('character_assets').update({ recommended: true }).eq('id', recommended.id);
    await supabase
      .from('character_generations')
      .update({
        status: 'completed',
        response_payload: generated.raw,
        best_asset_id: recommended.id
      })
      .eq('id', generation.id);

    return NextResponse.json({
      generation_id: generation.id,
      best_asset_id: recommended.id,
      assets: insertedAssets.map((a) => ({ ...a, recommended: a.id === recommended.id }))
    });
  } catch (error: any) {
    await supabase
      .from('character_generations')
      .update({ status: 'failed', response_payload: { error: error?.message ?? 'unknown error' } })
      .eq('id', generation.id);

    return NextResponse.json({ error: error?.message ?? 'generation failed' }, { status: 500 });
  }
}
