import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";

const ADMIN_PREFIX = "/admin";
const CUSTOMER_PREFIX = "/tickets";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  
  if (pathname.startsWith(ADMIN_PREFIX) && session.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/tickets", request.url));
  }

  if (pathname.startsWith(CUSTOMER_PREFIX) && session.role !== "CUSTOMER") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

// Only these two trees require a session — /login and /register stay public
export const config = {
  matcher: ["/admin/:path*", "/tickets/:path*"],
};
