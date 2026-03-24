import { NextResponse, type NextRequest } from "next/server";

// Lightweight, non-blocking middleware.
// Does NOT call Supabase, external APIs, or workers.
// Prevents 504 timeouts and keeps the site online.

export function middleware(req: NextRequest) {
  // Allow health checks to bypass everything
  if (req.nextUrl.pathname.startsWith("/api/health")) {
    return NextResponse.next();
  }

  // Allow static assets
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/favicon") ||
    req.nextUrl.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)
  ) {
    return NextResponse.next();
  }

  // Example: simple auth check using cookie presence only
  const hasSession = req.cookies.get("sb-access-token");

  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith("/dashboard") && !hasSession) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
