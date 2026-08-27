import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { RegisterForm } from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-4xl flex-col gap-6 p-6 sm:p-10">
        <div className="flex flex-col gap-1">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            &larr; Strona główna
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Zarejestruj się</h1>
        </div>
        <RegisterForm />
      </main>
    </>
  );
}
