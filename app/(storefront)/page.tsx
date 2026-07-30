import { Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Preloader from "@/components/storefront/preloader";
import HeroAnimationManager from "@/components/storefront/hero-animation-manager";
import HeroSectionClient from "@/components/storefront/hero-section-client";
import ProductGrid from "@/components/storefront/product-grid";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

const SaleSection = dynamic(() => import("@/components/storefront/sale-section"), {
  loading: () => (
    <section className="section-spacing">
      <div className="container-wide">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-dark-grey aspect-[4/3] animate-pulse rounded-xl" />
          <div className="bg-dark-grey aspect-[4/3] animate-pulse rounded-xl" />
        </div>
      </div>
    </section>
  ),
});

const AboutSection = dynamic(() => import("@/components/storefront/about-section"), {
  loading: () => (
    <section className="section-spacing">
      <div className="container-wide">
        <div className="flex flex-col items-center gap-6">
          <div className="bg-dark-grey h-8 w-64 animate-pulse rounded" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-dark-grey aspect-square animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </section>
  ),
});

const ScatterTestimonial = dynamic(() => import("@/components/storefront/scatter-testimonial"), {
  loading: () => (
    <section className="section-spacing relative">
      <div className="container-wide">
        <div className="bg-dark-grey h-8 w-56 animate-pulse rounded mb-8" />
        <div className="relative h-[500px] sm:h-[700px]">
          {[
            { top: "5%", left: "5%", rotate: "-3deg" },
            { top: "2%", left: "40%", rotate: "2deg" },
            { top: "15%", left: "70%", rotate: "-2deg" },
            { top: "45%", left: "15%", rotate: "4deg" },
            { top: "50%", left: "55%", rotate: "-4deg" },
          ].map((pos, i) => (
            <div
              key={i}
              className="bg-dark-grey absolute w-48 animate-pulse rounded-xl sm:w-64"
              style={{ top: pos.top, left: pos.left, transform: `rotate(${pos.rotate})` }}
            >
              <div className="aspect-[3/4] rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
});

const FaqSection = dynamic(() => import("@/components/storefront/faq-section"), {
  loading: () => (
    <section className="section-spacing">
      <div className="container-wide">
        <div className="border-steel-gray/20 border-t pt-16">
          <div className="bg-dark-grey h-8 w-64 animate-pulse rounded mb-8" />
          <div className="flex flex-col gap-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border-steel-gray/20 border-b py-5">
                <div className="flex items-center gap-4">
                  <div className="bg-dark-grey h-5 w-5 animate-pulse rounded" />
                  <div className="bg-dark-grey h-5 animate-pulse rounded" style={{ width: `${60 + Math.random() * 30}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  ),
});

export const revalidate = 60;

export const metadata: Metadata = {
  title: "MidRange — Gen-Z Thrift Store",
  description: "One-of-one thrift finds. Bold style, honest prices. Curated secondhand clothing for men and women.",
  openGraph: {
    title: "MidRange — Gen-Z Thrift Store",
    description: "One-of-one thrift finds. Bold style, honest prices.",
    type: "website",
    siteName: "MidRange",
  },
};

const HERO_HEADINGS = [
  { text: "F*ck fast fashion.", delay: 2 },
  { text: "Wear something", delay: 3, className: "text-red-gradient" },
  { text: "with a history.", delay: 4 },
];
const HERO_WORD_STAGGER = 0.06;
const HERO_BUTTON_DELAY = 5;

function HeroHeading() {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center pointer-events-none max-[443px]:-translate-y-[5.5em] -translate-y-[4.5em]">
      {/* Desktop */}
      <div className="hidden min-[443px]:flex flex-col items-center">
        <h1
          className="flex flex-col font-hero text-light-grey font-bold tracking-wide uppercase leading-[0.92]"
          style={{ fontSize: "clamp(2.2rem, 5vw + 0.4rem, 5.5rem)" }}
        >
          {HERO_HEADINGS.map((line, lineIndex) => (
            <span key={lineIndex} style={{ display: "block" }}>
              {line.text.split(" ").map((word, wordIndex, arr) => (
                <span
                  key={wordIndex}
                  className={`hero-word ${line.className ?? ""}`}
                  style={{ "--hero-delay": `${line.delay + wordIndex * HERO_WORD_STAGGER}s` } as React.CSSProperties}
                >
                  {word}{wordIndex < arr.length - 1 ? "\u00A0" : ""}
                </span>
              ))}
            </span>
          ))}
        </h1>
        <div className="mt-6 pointer-events-auto hero-word" style={{ "--hero-delay": `${HERO_BUTTON_DELAY}s` } as React.CSSProperties}>
          <Link href="/collections" className="btn-primary font-hero text-sm md:text-[17px]">
            Start Hunting
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex min-[443px]:hidden flex-col items-center">
        <h1
          className="flex flex-col font-hero text-light-grey font-bold tracking-wide uppercase leading-[0.92] hero-mobile"
          style={{ fontSize: "clamp(1.8rem, 8vw, 2.6rem)" }}
        >
          {HERO_HEADINGS.map((line, lineIndex) => (
            <span key={lineIndex} style={{ display: "block" }}>
              {line.text.split(" ").map((word, wordIndex, arr) => (
                <span
                  key={wordIndex}
                  className={`hero-word ${line.className ?? ""}`}
                  style={{ "--hero-delay": `${line.delay + wordIndex * HERO_WORD_STAGGER}s` } as React.CSSProperties}
                >
                  {word}{wordIndex < arr.length - 1 ? "\u00A0" : ""}
                </span>
              ))}
            </span>
          ))}
        </h1>
        <div className="mt-5 pointer-events-auto hero-word" style={{ "--hero-delay": `${HERO_BUTTON_DELAY}s` } as React.CSSProperties}>
          <Link href="/collections" className="btn-primary font-hero max-[425px]:text-xs max-[425px]:px-3 max-[425px]:py-1.5 text-sm">
            Start Hunting
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

async function HeroSection() {
  const [carouselImages] = await Promise.all([
    prisma.roundCarouselImage.findMany({
      where: { active: true }, orderBy: { order: "asc" },
      select: { imageUrl: true },
    }).then((rows) => rows.map((r) => r.imageUrl)),
  ]);
  return (
    <div className="relative" style={{ height: "85vh", minHeight: 500 }}>
      <HeroHeading />
      <HeroSectionClient initialCarouselImages={carouselImages} />
    </div>
  );
}

async function SaleSectionWithDB() {
  const saleImages = await prisma.saleSectionImage.findMany({
    where: { active: true }, orderBy: { order: "asc" },
    select: { imageUrl: true, altText: true },
  }).then((rows) => rows.map((r) => ({ imageUrl: r.imageUrl, altText: r.altText })));
  return <SaleSection initialImages={saleImages} />;
}

async function TestimonialsSection() {
  const testimonials = await prisma.testimonial.findMany({
    where: { active: true }, orderBy: { order: "asc" },
    select: { name: true, imageUrl: true, text: true, rating: true },
  }).then((rows) => rows.map((r) => ({ name: r.name, imageUrl: r.imageUrl, text: r.text, rating: r.rating })));
  return <ScatterTestimonial initialTestimonials={testimonials} />;
}

async function ProductsSection() {
  const products = await prisma.product.findMany({
    where: { status: "available" }, orderBy: { createdAt: "desc" }, take: 12,
    select: {
      id: true, title: true, slug: true, price: true, discountedPrice: true,
      images: true, size: true, status: true,
    },
  });
  return <ProductGrid products={products} />;
}

export default function HomePage() {
  return (
    <>
      <Preloader />
      <HeroAnimationManager />
      <main>
        <Suspense fallback={<div className="relative bg-dark-grey/30 h-[85vh] min-h-[500px] animate-pulse" />}>
          <HeroSection />
        </Suspense>

        <Suspense fallback={
          <section className="section-spacing">
            <div className="container-wide">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="bg-dark-grey aspect-[4/3] animate-pulse rounded-xl" />
                <div className="bg-dark-grey aspect-[4/3] animate-pulse rounded-xl" />
              </div>
            </div>
          </section>
        }>
          <SaleSectionWithDB />
        </Suspense>

        <Suspense fallback={
          <section className="section-spacing">
            <div className="container-wide">
              <div className="flex flex-col items-center gap-6">
                <div className="bg-dark-grey h-8 w-64 animate-pulse rounded" />
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-dark-grey aspect-square animate-pulse rounded-2xl" />
                  ))}
                </div>
              </div>
            </div>
          </section>
        }>
          <AboutSection />
        </Suspense>

        <Suspense fallback={
          <section className="section-spacing relative">
            <div className="container-wide">
              <div className="bg-dark-grey mb-8 h-8 w-56 animate-pulse rounded" />
              <div className="relative h-[500px] sm:h-[700px]">
                {[
                  { top: "5%", left: "5%", rotate: "-3deg" },
                  { top: "2%", left: "40%", rotate: "2deg" },
                  { top: "15%", left: "70%", rotate: "-2deg" },
                  { top: "45%", left: "15%", rotate: "4deg" },
                  { top: "50%", left: "55%", rotate: "-4deg" },
                ].map((pos, i) => (
                  <div
                    key={i}
                    className="bg-dark-grey absolute w-48 animate-pulse rounded-xl sm:w-64"
                    style={{ top: pos.top, left: pos.left, transform: `rotate(${pos.rotate})` }}
                  >
                    <div className="aspect-[3/4] rounded-xl" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        }>
          <TestimonialsSection />
        </Suspense>

        <Suspense fallback={
          <section className="section-spacing">
            <div className="container-wide">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-dark-grey aspect-[4/5] animate-pulse rounded-lg" />
                ))}
              </div>
            </div>
          </section>
        }>
          <ProductsSection />
        </Suspense>

        <Suspense fallback={
          <section className="section-spacing">
            <div className="container-wide">
              <div className="border-steel-gray/20 border-t pt-16">
                <div className="bg-dark-grey mb-8 h-8 w-64 animate-pulse rounded" />
                <div className="flex flex-col gap-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="border-steel-gray/20 border-b py-5">
                      <div className="flex items-center gap-4">
                        <div className="bg-dark-grey h-5 w-5 animate-pulse rounded" />
                        <div className="bg-dark-grey h-5 animate-pulse rounded" style={{ width: `${60 + i * 5}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        }>
          <FaqSection />
        </Suspense>
      </main>
    </>
  );
}
