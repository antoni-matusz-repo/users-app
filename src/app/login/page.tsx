import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { buttonVariants } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Logowanie — wkrótce</h1>
        <p className="text-muted-foreground">
          Logowanie jest jeszcze w przygotowaniu. Wróć tutaj wkrótce.
        </p>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          &larr; Wróć na stronę główną
        </Link>
      </main>
    </>
  );
}
