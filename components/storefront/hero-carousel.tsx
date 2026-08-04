"use client";

import { useState, useEffect } from "react";
import RoundCarousel from "./round-carousel";
import MagicRings from "@/components/ui/magic-rings";
import { getHeroConfig } from "@/lib/hero-config";

export default function HeroCarousel({ initialCarouselImages }: { initialCarouselImages?: string[] }) {
  const [config, setConfig] = useState(() => getHeroConfig(window.innerWidth, window.matchMedia("(pointer: coarse)").matches));

  useEffect(() => {
    const onResize = () => setConfig(getHeroConfig(window.innerWidth, window.matchMedia("(pointer: coarse)").matches));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <MagicRings
        color="#E11D2E"
        colorTwo="#ff6b6b"
        speed={0.4}
        ringCount={config.rings.ringCount}
        opacity={config.rings.opacity}
        attenuation={config.rings.attenuation}
        baseRadius={config.rings.baseRadius}
        radiusStep={config.rings.radiusStep}
        lineThickness={config.rings.lineThickness}
        rotation={config.rings.rotation}
        className="absolute inset-0 z-[1] pointer-events-none"
      />

      <RoundCarousel initialImages={initialCarouselImages} />
    </>
  );
}
