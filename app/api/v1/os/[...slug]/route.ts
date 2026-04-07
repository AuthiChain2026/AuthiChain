import { NextRequest, NextResponse } from 'next/server';
const SUPA = 'https://nhdnkzhtadfkkluiulhs.supabase.co/functions/v1';
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oZG5remh0YWRma2tsdWl1bGxocyIsInJlbG8iOiJhbm9uIiwiaWF0IjoxNjcyMTkzODIxNSwiZXpAIjoyMDg5NTE0MjE1fQ.akaWgxRilbjavzpsLqU149nBJqxDjbYOnRdAqrwz4J8';
const FN_MAP: Record<string, string> = { scan: 'authichain-scan', verify: 'authichain-verify', register: 'authichain-register', events: 'authichain-events', story: 'storymode', rewards: 'qron-rewards', apikeys: 'authichain-apikeys' };
export async function GET(req: NextRequest, { params }: { params: { slug: string[] } }) { return proxy(req, params.slug); }
export async function POST(req: NextRequest, { params }: { params: { slug: string[] } }) { return proxy(req, params.slug); }
async function proxy(req: NextRequest, slug: string[]) {
  const action = slug[0];
  const fn = FN_MAP[action];
  if (!fn) return NextResponse.json({ error: 'Unknown OS action' }, { status: 404 });
  const subPath = slug.slice(1).join('/');
  const query = req.nextUrl.searchParams.toString();
  const target = `${SUPA}/${fn}${subPath ? '/'+subPath : ''}${query ? '?'+query : ''}`;
  const res = await fetch(target, { method: req.method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ANON}` }, body: req.method !== 'GET' ? req.body : undefined });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}