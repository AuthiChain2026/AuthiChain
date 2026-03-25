import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/api/") || pathname.startsWith("/_next") || pathname.startsWith("/favicon") || pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/)) return NextResponse.next();
  return await updateSession(req);
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };
