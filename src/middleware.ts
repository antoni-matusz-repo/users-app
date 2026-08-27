import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { guardProtectedRouteWith } from "@/server/routeProtection";

// `runtime: "nodejs"` jest tu wymagane — bez tego middleware domyślnie
// startuje na Edge, gdzie Prisma (auth.api.getSession) nie działa.
// (Next.js 16 wprowadza nowszą konwencję proxy.ts, zawsze uruchamianą na
// Node.js bez dodatkowej konfiguracji, ale w praktyce po wdrożeniu na
// Vercel powodowała 500 na każdej trasie — wygląda na brak wsparcia dla
// tej bardzo świeżej konwencji w obecnym builderze Vercela. Wracamy do
// sprawdzonego middleware.ts, mimo że Next.js oznacza je jako
// deprecated.)
export async function middleware(request: NextRequest) {
  const result = await guardProtectedRouteWith(
    auth,
    request.headers,
    request.nextUrl.pathname,
  );

  if (result.type === "redirect") {
    return NextResponse.redirect(new URL(result.url, request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/users/:path*", "/dashboard"],
};
