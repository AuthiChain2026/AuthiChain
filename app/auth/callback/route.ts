import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('[auth/callback] Code exchange failed:', error.message)
      const loginUrl = new URL('/login', requestUrl.origin)
      loginUrl.searchParams.set('error', 'auth_failed')
      loginUrl.searchParams.set('message', error.message)
      return NextResponse.redirect(loginUrl)
    }
  } else {
    // No code present — redirect to login with error
    const loginUrl = new URL('/login', requestUrl.origin)
    loginUrl.searchParams.set('error', 'no_code')
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to the intended destination after successful sign-in
  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
