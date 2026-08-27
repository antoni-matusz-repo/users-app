import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { guardProtectedRouteWith } from "@/server/routeProtection";

// Next.js 16 uwierzytelnia sesję Better Auth tu, na Node.js runtime (proxy
// zawsze działa na Node.js, w przeciwieństwie do przestarzałego
// middleware.ts, które domyślnie startuje na Edge) — pozwala to na
// bezpośrednie odpytanie bazy przez auth.api.getSession bez pośredniego
// sprawdzania samego ciasteczka.
export default async function proxy(request: NextRequest) {
  const result = await guardProtectedRouteWith(auth, request.headers, request.nextUrl.pathname);

  if (result.type === "redirect") {
    return NextResponse.redirect(new URL(result.url, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/users/:path*", "/dashboard"],
};
