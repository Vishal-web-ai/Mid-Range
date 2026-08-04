"use client";

import { useEffect, useState } from "react";
import HeroCarousel from "@/components/storefront/hero-carousel";

export default function HeroSectionClient({ initialCarouselImages }: { initialCarouselImages?: string[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? <HeroCarousel initialCarouselImages={initialCarouselImages} /> : null;
}
