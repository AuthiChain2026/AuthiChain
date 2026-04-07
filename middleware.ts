import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Google Search Console verification file
  const m = pathname.match(/^\/google([a-zA-Z0-9_-]+)\.html$/)
  if (m) {
    return new NextResponse(`google-site-verification: google${m[1]}.html`, {
      headers: { 'Content-Type': 'text/html' },
    })
  }

  // Refresh Supabase session on every request
  return updateSession(req)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
