import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const tokenHash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type') as 'signup' | 'magiclink' | 'recovery' | 'invite' | null
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  const supabase = await createClient()
  let authError: string | null = null

  if (code) {
    // PKCE flow (OAuth, magic link, email confirmation)
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) authError = error.message
  } else if (tokenHash && type) {
    // Email OTP / token_hash flow (email confirmation, password reset)
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    if (error) authError = error.message
  } else {
    authError = 'no_auth_params'
  }

  if (authError) {
    console.error('[auth/callback] Auth failed:', authError)
    const loginUrl = new URL('/login', requestUrl.origin)
    loginUrl.searchParams.set('error', 'auth_failed')
    loginUrl.searchParams.set('message', authError)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
