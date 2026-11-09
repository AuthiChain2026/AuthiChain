import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

const DOMAIN_MAP: Record<string, string> = {
  'qron.space': '/qron',
  'www.qron.space': '/qron',
  'strainchain.io': '/strainchain',
  'www.strainchain.io': '/strainchain',
  'govchain.us': '/govchain',
  'www.govchain.us': '/govchain',
}

export async function middleware(req: NextRequest) {
  const { pathname, headers } = req
  
  // 1. Google Search Console verification (PRESERVED)
    const m = pathname.match(new RegExp('^/google([a-zA-Z0-9_-]+)\\.html$'))
  if (m) {
    return new NextResponse(`google-site-verification: google${m[1]}.html`, {
      headers: { 'Content-Type': 'text/html' },
    })
  }

  // Refresh Supabase session on every request
  return await updateSession(req)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
