"use client";

import dynamic from "next/dynamic";

const HeroCarousel = dynamic(() => import("@/components/storefront/hero-carousel"), { ssr: false });

export default function HeroSectionClient({ initialCarouselImages }: { initialCarouselImages?: string[] }) {
  return <HeroCarousel initialCarouselImages={initialCarouselImages} />;
}
