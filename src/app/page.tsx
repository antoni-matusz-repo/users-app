import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { buttonVariants } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const slides = [
  {
    src: "/landing/office-workspace.jpg",
    alt: "Nowoczesne biuro typu open space z zespołem przy pracy",
  },
  {
    src: "/landing/team-collaboration.jpg",
    alt: "Zespół omawiający projekt przy stole",
  },
  {
    src: "/landing/technology-workspace.jpg",
    alt: "Laptop i kawa na drewnianym biurku",
  },
  {
    src: "/landing/leadership-meeting.jpg",
    alt: "Prezentacja podczas spotkania zespołu",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-16 text-center sm:py-24">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            System do zarządzania użytkownikami
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground text-balance">
            Rejestracja, role i uprawnienia, panel administracyjny — wszystko w jednym miejscu.
            Zarządzaj kontami swojego zespołu szybko i bez chaosu w arkuszach kalkulacyjnych.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/register" className={buttonVariants({ size: "lg" })}>
              Zarejestruj się
            </Link>
            <Link href="/users" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Zobacz demo
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-16 sm:pb-24">
          <Carousel className="w-full">
            <CarouselContent>
              {slides.map((slide) => (
                <CarouselItem key={slide.src}>
                  <div className="overflow-hidden rounded-xl border">
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      width={1600}
                      height={1067}
                      className="aspect-video w-full object-cover"
                      sizes="(min-width: 896px) 896px, 100vw"
                      priority={slide === slides[0]}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </section>
      </main>
    </>
  );
}
