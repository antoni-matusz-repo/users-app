import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-4 sm:gap-4 sm:px-6">
        <Link href="/" className="shrink-0 text-lg font-semibold tracking-tight">
          Users App
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            <span className="sm:hidden">Zaloguj</span>
            <span className="hidden sm:inline">Zaloguj się</span>
          </Link>
          <Link href="/register" className={buttonVariants({ size: "sm" })}>
            <span className="sm:hidden">Rejestracja</span>
            <span className="hidden sm:inline">Zarejestruj się</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
