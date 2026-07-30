"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";

const fallbackImages = [
  "/clothes/672414455_17861864229682647_3753836623058430552_n..jpg",
  "/clothes/671244443_17861866125682647_1055540794517676545_n..jpg",
  "/clothes/671172413_17861842770682647_7895852993908659170_n..jpg",
  "/clothes/671106172_17861862861682647_9060639759909450645_n..jpg",
  "/clothes/670981231_17861868180682647_8729711116844242284_n..jpg",
  "/clothes/670954849_17861859261682647_6344359944749683983_n..jpg",
  "/clothes/670885305_17861866086682647_4525697963580129592_n..jpg",
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

function getConfig(width: number) {
  const minW = 320;
  const maxW = 1440;
  const t = Math.min(1, Math.max(0, (width - minW) / (maxW - minW)));
  return {
    RX: lerp(150, 400, t),
    RY: lerp(105, 250, t),
    CARD: lerp(110, 260, t),
    SPEED: lerp(0.14, 0.1, t),
  };
}

export default function RoundCarousel({ initialImages }: { initialImages?: string[] }) {
  const [images, setImages] = useState(initialImages && initialImages.length > 0 ? initialImages : fallbackImages);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const angleRef = useRef(0);
  const velocityRef = useRef(0.15);
  const rxRef = useRef(400);
  const ryRef = useRef(250);
  const rafRef = useRef<number>(0);
  const [cardSize, setCardSize] = useState(260);
  const [orbitReady, setOrbitReady] = useState(false);

  useEffect(() => {
    if (initialImages) return;
    const controller = new AbortController();
    fetch("/api/round-carousel", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const active = data.filter((i: { active: boolean }) => i.active);
          if (active.length > 0) setImages(active.map((i: { imageUrl: string }) => i.imageUrl));
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, [initialImages]);

  useEffect(() => {
    const cfg = getConfig(window.innerWidth);
    velocityRef.current = cfg.SPEED;
    rxRef.current = cfg.RX;
    ryRef.current = cfg.RY;
    setCardSize(cfg.CARD);

    function onResize() {
      const c = getConfig(window.innerWidth);
      rxRef.current = c.RX;
      ryRef.current = c.RY;
      setCardSize(c.CARD);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const nav = performance.getEntriesByType?.("navigation")?.[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type === "reload") sessionStorage.removeItem("midrange-hero-seen");

    if (sessionStorage.getItem("midrange-hero-seen")) {
      const total = images.length;
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const a = (2 * Math.PI * i) / total;
        const x = Math.cos(a) * rxRef.current;
        const y = Math.sin(a) * ryRef.current;
        const normY = (y + ryRef.current) / (2 * ryRef.current);
        card.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${0.55 + normY * 0.45})`;
        card.style.opacity = String(0.25 + normY * 0.75);
        card.style.zIndex = String(Math.round(1 + normY * 30));
      });
      setOrbitReady(true);
      return;
    }

    const vw = window.innerWidth;
    cardsRef.current.forEach((card) => {
      if (!card) return;
      gsap.set(card, {
        xPercent: -50,
        yPercent: -50,
        x: vw + 300,
        y: 0,
        scale: 0.3,
        opacity: 0,
      });
    });

    let cancelled = false;
    const timeout = setTimeout(() => {
      if (cancelled) return;
      const tl = gsap.timeline({
        onComplete: () => {
          if (cancelled) return;
          sessionStorage.setItem("midrange-hero-seen", "1");
          setOrbitReady(true);
        },
      });

      const total = images.length;
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const targetAngle = (2 * Math.PI * i) / total;
        const targetX = Math.cos(targetAngle) * rxRef.current;
        const targetY = Math.sin(targetAngle) * ryRef.current;
        const normY = (targetY + ryRef.current) / (2 * ryRef.current);
        const targetScale = 0.55 + normY * 0.45;
        const targetOpacity = 0.25 + normY * 0.75;

        tl.to(
          card,
          {
            x: targetX,
            y: targetY,
            scale: targetScale,
            opacity: targetOpacity,
            duration: 1.2,
            ease: "power3.out",
          },
          i * 0.18,
        );
      });
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      cardsRef.current.forEach((card) => {
        if (card) gsap.killTweensOf(card);
      });
    };
  }, []);

  useEffect(() => {
    if (!orbitReady) return;

    const total = images.length;
    const step = (2 * Math.PI) / total;
    let cancelled = false;

    function loop() {
      if (cancelled) return;
      angleRef.current += velocityRef.current * (Math.PI / 180);

      cardsRef.current.forEach((card, i) => {
        if (!card || cancelled) return;
        const a = angleRef.current + i * step;
        const x = Math.cos(a) * rxRef.current;
        const y = Math.sin(a) * ryRef.current;
        const normY = (y + ryRef.current) / (2 * ryRef.current);
        const scale = 0.55 + normY * 0.45;
        const opacity = 0.25 + normY * 0.75;
        const z = Math.round(1 + normY * 30);

        card.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`;
        card.style.opacity = String(opacity);
        card.style.zIndex = String(z);
      });

      if (!cancelled) {
        rafRef.current = requestAnimationFrame(loop);
      }
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
    };
  }, [orbitReady]);

  return (
    <div
      className="absolute inset-0 z-10 pointer-events-none select-none"
      suppressHydrationWarning
    >
      <div className="relative h-full w-full" style={{ perspective: "600px" }}>
        <div className="absolute inset-0">
          {images.map((src, i) => (
            <div
              key={i}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="absolute left-1/2 top-1/2 overflow-hidden rounded-lg border border-white/10"
              style={{
                width: cardSize,
                height: cardSize,
                willChange: "transform, opacity",
              }}
            >
              <Image
                src={src}
                alt="Vintage clothing"
                fill
                className="object-cover"
                sizes={`${cardSize}px`}
                priority
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
