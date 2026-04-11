/**
 * app/api/qron/generate/route.ts
 *
 * Full generation pipeline:
 *   1. Auth via Supabase session
 *   2. Credit check / deduction
 *   3. Call fal-ai/illusion-diffusion directly via @fal-ai/client
 *   4. Fire /api/qron/register (Supabase row + AuthiChain D1 cross-reg)
 *   5. Return imageUrl + registration IDs
 *
 * Replaces the Supabase Edge Function proxy — fal.ai is called server-side
 * so FAL_KEY never touches the client.
 */

import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { createClient } from "@/utils/supabase/server";
import { createClient as createAdmin } from "@supabase/supabase-js";
import crypto from "crypto";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// ─── fal.ai client config ────────────────────────────────────────────────────
fal.config({ credentials: process.env.FAL_KEY! });

// ─── Types ────────────────────────────────────────────────────────────────────
interface GenerateBody {
  url?: string;
  prompt?: string;
  presetId?: string;
  mode?: string;
  negative_prompt?: string;
  guidance_scale?: number;
  controlnet_conditioning_scale?: number;
  num_inference_steps?: number;
  scheduler?: "Euler" | "DPM++ Karras SDE";
  image_size?: "square_hd" | "square" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9";
  seed?: number;
  image_url?: string;
}

interface FalOutput {
  image: { url: string; width: number; height: number; content_type: string };
  seed: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function adminClient() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function qrPatternUrl(payloadUrl: string): string {
  const encoded = encodeURIComponent(payloadUrl);
  return `https://api.qrserver.com/v1/create-qr-code/?size=512x512&ecc=H&data=${encoded}`;
}

// ─── Credit check ─────────────────────────────────────────────────────────────

async function checkAndDeductCredit(userId: string): Promise<boolean> {
  const admin = adminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("credits, plan")
    .eq("id", userId)
    .single();

  if (!profile) return false;
  if (profile.plan === "business") return true;
  if ((profile.credits ?? 0) < 1) return false;

  const { error } = await admin
    .from("profiles")
    .update({ credits: profile.credits - 1 })
    .eq("id", userId);

  return !error;
}

// ─── Registration ─────────────────────────────────────────────────────────────

async function registerQron(params: {
  userId: string;
  assetUrl: string;
  payloadUrl: string;
  prompt: string;
  seed: number;
}): Promise<{ id: string | null; authichain_record_id: string | null }> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://www.authichain.com";
  const payloadHash = sha256(params.payloadUrl);

  try {
    const res = await fetch(`${baseUrl}/api/qron/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AUTHICHAIN_API_SECRET}`,
      },
      body: JSON.stringify({
        user_id: params.userId,
        asset_url: params.assetUrl,
        payload_hash: payloadHash,
        payload_preview: params.payloadUrl.slice(0, 100),
        prompt: params.prompt,
        seed: params.seed,
        chain: "polygon",
        status: "pending_mint",
        registered_at: new Date().toISOString(),
        source: "qron-generate-direct",
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      console.warn("[qron/generate] register returned", res.status);
      return { id: null, authichain_record_id: null };
    }

    const data = (await res.json()) as {
      id?: string;
      authichain_record_id?: string;
    };
    return {
      id: data.id ?? null,
      authichain_record_id: data.authichain_record_id ?? null,
    };
  } catch (err) {
    console.warn("[qron/generate] register unreachable:", err);
    return { id: null, authichain_record_id: null };
  }
}

// ─── POST handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  let body: GenerateBody = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const payloadUrl = body.url?.trim();
  const prompt = body.prompt?.trim();

  if (!payloadUrl) {
    return NextResponse.json(
      { error: "url (QR payload) is required" },
      { status: 400 }
    );
  }
  if (!prompt && !body.presetId) {
    return NextResponse.json(
      { error: "prompt or presetId is required" },
      { status: 400 }
    );
  }

  const hasCredit = await checkAndDeductCredit(userId);
  if (!hasCredit) {
    return NextResponse.json(
      {
        error: "Credit limit reached. Upgrade your plan to continue.",
        code: "LIMIT_REACHED",
      },
      { status: 403 }
    );
  }

  const imageUrl = body.image_url ?? qrPatternUrl(payloadUrl);

  let falResult: FalOutput;
  try {
    const result = await fal.subscribe("fal-ai/illusion-diffusion", {
      input: {
        image_url: imageUrl,
        prompt: prompt ?? "(masterpiece:1.4), (best quality), (detailed), vibrant living art QR portal",
        negative_prompt:
          body.negative_prompt ??
          "(worst quality, poor details:1.4), lowres, watermark, signature",
        guidance_scale: body.guidance_scale ?? 7.5,
        controlnet_conditioning_scale:
          body.controlnet_conditioning_scale ?? 1.0,
        control_guidance_start: 0,
        control_guidance_end: 1,
        scheduler: body.scheduler ?? "Euler",
        num_inference_steps: body.num_inference_steps ?? 40,
        image_size: body.image_size ?? "square_hd",
        ...(body.seed !== undefined && { seed: body.seed }),
      },
      logs: false,
    });

    falResult = result.data as FalOutput;
  } catch (err) {
    console.error("[qron/generate] fal.ai error:", err);
    try {
      const admin = adminClient();
      const { data: p } = await admin
        .from("profiles")
        .select("credits")
        .eq("id", userId)
        .single();
      if (p) await admin.from("profiles").update({ credits: p.credits + 1 }).eq("id", userId);
    } catch { /* best-effort refund */ }

    return NextResponse.json(
      { error: "Image generation failed. Credit has been refunded." },
      { status: 500 }
    );
  }

  const generatedImageUrl = falResult.image.url;
  const seed = falResult.seed;

  const registration = await registerQron({
    userId,
    assetUrl: generatedImageUrl,
    payloadUrl,
    prompt: prompt ?? "",
    seed,
  });

  return NextResponse.json({
    imageUrl: generatedImageUrl,
    qrDataUrl: generatedImageUrl,
    prompt,
    url: payloadUrl,
    seed,
    registration_id: registration.id,
    authichain_record_id: registration.authichain_record_id,
    qron: {
      imageUrl: generatedImageUrl,
      destinationUrl: payloadUrl,
      prompt,
      seed,
      registration_id: registration.id,
      authichain_record_id: registration.authichain_record_id,
    },
  });
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    backend: "fal-ai/illusion-diffusion",
    model: "fal-ai/illusion-diffusion",
    version: "direct-v2",
  });
}
