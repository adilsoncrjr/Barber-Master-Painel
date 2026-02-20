import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/", "/checkout", "/areadocliente", "/app"];

export function middleware(request: NextRequest) {
  const sessionCookieName = process.env.SESSION_COOKIE_NAME ?? "barber_master_session";
  const { pathname } = request.nextUrl;
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }
  const sessionCookie = request.cookies.get(sessionCookieName)?.value;
  if (!sessionCookie) {
    const login = new URL("/login", request.url);
    login.searchParams.set("from", pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
