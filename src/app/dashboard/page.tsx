import { SiteHeader } from "@/components/SiteHeader";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ forbidden?: string }>;
}) {
  const { forbidden } = await searchParams;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-4xl flex-col gap-6 p-6 sm:p-10">
        {forbidden && (
          <p role="alert" className="text-sm text-destructive">
            Nie masz dostępu do tej strony.
          </p>
        )}
        <h1 className="text-2xl font-semibold tracking-tight">Hello world</h1>
      </main>
    </>
  );
}
