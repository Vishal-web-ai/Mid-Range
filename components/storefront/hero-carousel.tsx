"use client";

import { useState, useEffect } from "react";
import RoundCarousel from "./round-carousel";
import MagicRings from "@/components/ui/magic-rings";

export default function HeroCarousel({ initialCarouselImages }: { initialCarouselImages?: string[] }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 430);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      <MagicRings
        color="#E11D2E"
        colorTwo="#ff6b6b"
        speed={0.4}
        ringCount={isMobile ? 6 : 4}
        opacity={isMobile ? 1 : 0.5}
        attenuation={isMobile ? 25 : 10}
        baseRadius={isMobile ? 0.5 : 0.9}
        radiusStep={isMobile ? 0.08 : 0.15}
        lineThickness={isMobile ? 2 : 3}
        rotation={isMobile ? 90 : 0}
        className="absolute inset-0 z-[1]"
      />

      <RoundCarousel initialImages={initialCarouselImages} />
    </>
  );
}
