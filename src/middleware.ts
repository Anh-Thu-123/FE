import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

/**
 * Admin gate. This is a UX convenience only: it checks for the presence of a
 * non-httpOnly cookie ("nagare_session") that the frontend sets right after a
 * successful login, purely so we can bounce obviously-logged-out visitors away
 * from /admin without a flash of the dashboard shell.
 *
 * The REAL authorization check happens on the backend (Spring Security
 * @PreAuthorize + role/permission checks on every endpoint, and scoped Mongo
 * queries for "own scope" data). Even if someone forges this cookie, every API
 * call will still be rejected by the backend. Never rely on this middleware to
 * hide anything security-sensitive.
 */
function isAdminPath(pathname: string) {
  return /^\/(vi|ja)\/admin(\/|$)/.test(pathname);
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAdminPath(pathname)) {
    const hasSessionHint = request.cookies.get("nagare_session")?.value;
    if (!hasSessionHint) {
      const locale = pathname.split("/")[1] || routing.defaultLocale;
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
