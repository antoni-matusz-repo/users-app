import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { logoutUser } from "@/server/session";
import { Button, buttonVariants } from "@/components/ui/button";

export async function SiteHeader() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-4 sm:gap-4 sm:px-6">
        <Link href="/" className="shrink-0 text-lg font-semibold tracking-tight">
          Users App
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          {session ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {session.user.name}
              </span>
              <form action={logoutUser}>
                <Button type="submit" variant="ghost" size="sm">
                  Wyloguj
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                <span className="sm:hidden">Zaloguj</span>
                <span className="hidden sm:inline">Zaloguj się</span>
              </Link>
              <Link href="/register" className={buttonVariants({ size: "sm" })}>
                <span className="sm:hidden">Rejestracja</span>
                <span className="hidden sm:inline">Zarejestruj się</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
