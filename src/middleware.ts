import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "arre_session";

/**
 * Gate for every /admin route except the login page.
 * Verifies the session JWT so unauthenticated requests never reach the dashboard.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(COOKIE)?.value;
  const secret = process.env.SESSION_SECRET;

  if (token && secret) {
    try {
      await jwtVerify(token, new TextEncoder().encode(secret));
      return NextResponse.next();
    } catch {
      // Fall through to the redirect below.
    }
  }

  const login = new URL("/admin/login", request.url);
  if (pathname !== "/admin") login.searchParams.set("next", pathname + search);
  const response = NextResponse.redirect(login);
  response.cookies.delete(COOKIE);
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
