/**
 * app/api/qron/register/route.ts
 *
 * Receives QRON generation data and writes provenance records to Supabase.
 * Also forwards to the AuthiChain D1 worker for cross-registration.
 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (!token || token !== process.env.AUTHICHAIN_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.asset_url || !body.payload_hash) {
    return NextResponse.json(
      { error: "asset_url and payload_hash are required" },
      { status: 400 }
    );
  }

  const admin = adminClient();

  // Write to Supabase qron_registrations table
  const { data, error } = await admin
    .from("qron_registrations")
    .insert({
      user_id: body.user_id as string | null,
      asset_url: body.asset_url as string,
      payload_hash: body.payload_hash as string,
      payload_preview: (body.payload_preview as string) ?? null,
      prompt: (body.prompt as string) ?? null,
      seed: (body.seed as number) ?? null,
      chain: (body.chain as string) ?? "polygon",
      status: (body.status as string) ?? "pending_mint",
      source: (body.source as string) ?? "unknown",
      registered_at: (body.registered_at as string) ?? new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("[qron/register] Supabase insert error:", error);
    return NextResponse.json(
      { error: "Database write failed", detail: error.message },
      { status: 500 }
    );
  }

  // Forward to AuthiChain D1 worker (non-fatal)
  let authichainRecordId: string | null = null;
  const workerUrl = process.env.AUTHICHAIN_WORKER_URL;
  if (workerUrl) {
    try {
      const res = await fetch(`${workerUrl}/api/qron-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AUTHICHAIN_API_SECRET}`,
        },
        body: JSON.stringify({
          qron_id: data.id,
          ...body,
        }),
        signal: AbortSignal.timeout(8_000),
      });
      if (res.ok) {
        const d = await res.json();
        authichainRecordId = (d as { id?: string }).id ?? null;
      }
    } catch (err) {
      console.warn("[qron/register] D1 cross-reg failed:", err);
    }
  }

  return NextResponse.json(
    {
      id: data.id,
      authichain_record_id: authichainRecordId,
      status: body.status ?? "pending_mint",
      chain: body.chain ?? "polygon",
    },
    { status: 201 }
  );
}
