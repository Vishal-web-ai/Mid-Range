"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { getHeroConfig } from "@/lib/hero-config";
import { isLowEndDevice } from "@/lib/device-capabilities";

const fallbackImages = [
  "/clothes/672414455_17861864229682647_3753836623058430552_n..jpg",
  "/clothes/671244443_17861866125682647_1055540794517676545_n..jpg",
  "/clothes/671172413_17861842770682647_7895852993908659170_n..jpg",
  "/clothes/671106172_17861862861682647_9060639759909450645_n..jpg",
  "/clothes/670981231_17861868180682647_8729711116844242284_n..jpg",
  "/clothes/670954849_17861859261682647_6344359944749683983_n..jpg",
  "/clothes/670885305_17861866086682647_4525697963580129592_n..jpg",
];

export default function RoundCarousel({ initialImages }: { initialImages?: string[] }) {
  const [images, setImages] = useState(initialImages && initialImages.length > 0 ? initialImages : fallbackImages);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const angleRef = useRef(0);
  const [config] = useState(() => getHeroConfig(window.innerWidth));
  const velocityRef = useRef(config.carousel.SPEED);
  const rxRef = useRef(config.carousel.RX);
  const ryRef = useRef(config.carousel.RY);
  const rafRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardSize, setCardSize] = useState(config.carousel.CARD);
  const [orbitReady, setOrbitReady] = useState(false);
  const lowEnd = isLowEndDevice();

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
    function onResize() {
      const c = getHeroConfig(window.innerWidth).carousel;
      rxRef.current = c.RX;
      ryRef.current = c.RY;
      velocityRef.current = c.SPEED;
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
      const stagger = 0.18;
      const duration = 1.2;
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
            duration,
            ease: "power3.out",
          },
          i * stagger,
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
    const frameMs = lowEnd ? 1000 / 30 : 0;
    const speedFactor = lowEnd ? 2 : 1;
    const lastZ: string[] = new Array(total);
    const lastOpacity: string[] = new Array(total);
    let lastFrame = 0;
    let cancelled = false;
    let visible = true;
    let running = false;

    const loop = (t: number) => {
      if (cancelled) return;
      if (!visible) {
        running = false;
        return;
      }
      running = true;
      rafRef.current = requestAnimationFrame(loop);

      if (frameMs && t - lastFrame < frameMs) return;
      lastFrame = t;

      angleRef.current += velocityRef.current * speedFactor * (Math.PI / 180);

      cardsRef.current.forEach((card, i) => {
        if (!card || cancelled) return;
        const a = angleRef.current + i * step;
        const x = Math.cos(a) * rxRef.current;
        const y = Math.sin(a) * ryRef.current;
        const normY = (y + ryRef.current) / (2 * ryRef.current);
        const scale = 0.55 + normY * 0.45;
        const z = String(Math.round(1 + normY * 30));
        const op = String(0.25 + normY * 0.75);

        if (z !== lastZ[i]) {
          lastZ[i] = z;
          card.style.zIndex = z;
        }
        if (op !== lastOpacity[i]) {
          lastOpacity[i] = op;
          card.style.opacity = op;
        }
        card.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`;
      });
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        if (!running) rafRef.current = requestAnimationFrame(loop);
      } else {
        cancelAnimationFrame(rafRef.current);
        running = false;
      }
    });
    if (containerRef.current) io.observe(containerRef.current);

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      io.disconnect();
    };
  }, [orbitReady]);

  return (
    <div
      ref={containerRef}
      className="hero-carousel-shift absolute inset-0 z-10 pointer-events-none select-none"
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
