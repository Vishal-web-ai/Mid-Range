"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import ScrollReveal from "@/components/ui/scroll-reveal";
import StickerPeel from "@/components/ui/sticker-peel";
import { isLowEndDevice } from "@/lib/device-capabilities";

const cards = [
  { icon: "shield-check", label: "Verified\nAuthentic" },
  { icon: "truck", label: "Fast\nShipping" },
  { icon: "lock", label: "Secure\nPayments" },
  { icon: "refresh", label: "Easy\nReturns" },
];

export default function AboutSection() {
  const cardsRef = useRef<HTMLDivElement>(null);
  const blackBoxRef = useRef<HTMLDivElement>(null);
  const redContainerRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);
  const blackBoxAnimated = useRef(false);

  useEffect(() => {
    const container = cardsRef.current;
    if (!container) return;

    let cancelled = false;
    const lowEnd = isLowEndDevice();

    const items = container.querySelectorAll<HTMLElement>("[data-trust-card]");
    if (!items.length) return;

    gsap.set(items, { x: lowEnd ? -40 : -120, opacity: 0, rotation: lowEnd ? 0 : -90 });

    const sectionEl = container.closest("section");
    if (!sectionEl) return;

    function playAnimation() {
      if (animated.current || cancelled) return;
      animated.current = true;
      gsap.to(items, {
        x: 0,
        opacity: 1,
        rotation: 0,
        duration: lowEnd ? 0.6 : 1.4,
        ease: "power2.out",
        stagger: lowEnd ? 0.08 : 0.25,
      });
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          playAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(sectionEl);

    const redContainer = redContainerRef.current;
    const blackBox = blackBoxRef.current;
    if (redContainer && blackBox) {
      gsap.set(blackBox, { rotateY: lowEnd ? 0 : -90, opacity: 0 });
      const blackBoxObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !blackBoxAnimated.current && !cancelled) {
            blackBoxAnimated.current = true;
            gsap.to(blackBox, {
              rotateY: 6,
              opacity: 1,
              duration: lowEnd ? 0.7 : 2,
              ease: "power2.out",
            });
            blackBoxObserver.disconnect();
          }
        },
        { threshold: 0.3 },
      );
      blackBoxObserver.observe(redContainer);
      return () => {
        cancelled = true;
        observer.disconnect();
        blackBoxObserver.disconnect();
        gsap.killTweensOf(items);
        gsap.killTweensOf(blackBox);
      };
    }

    return () => {
      cancelled = true;
      observer.disconnect();
      gsap.killTweensOf(items);
    };
  }, []);

  return (
    <section className="section-spacing about-section-hero">
      <div className="container-wide">
        <ScrollReveal>
          <div className="mt-16 pb-12 sm:mt-24 sm:pb-16">
            <p className="font-hero font-bold mb-4 text-[1.8em] tracking-wide uppercase leading-none text-light-grey sm:text-[2.4em] md:text-[3em] lg:text-[3.6em]" style={{ wordSpacing: "0.05em" }}>
              Why people <span className="text-signal-red">trust</span> us
            </p>
            <div ref={cardsRef} className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
              {cards.map((item) => (
                <div
                  key={item.icon}
                  data-trust-card
                  className="border-light-grey/20 flex flex-col items-center gap-4 rounded-sm border p-6 sm:p-8"
                >
                  {item.icon === "shield-check" && (
                    <svg className="text-signal-red h-12 w-12 fill-current" viewBox="0 0 24 24">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 16l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
                    </svg>
                  )}
                  {item.icon === "truck" && (
                    <svg className="text-signal-red h-12 w-12 fill-current" viewBox="0 0 24 24">
                      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                    </svg>
                  )}
                  {item.icon === "lock" && (
                    <svg className="text-signal-red h-12 w-12 fill-current" viewBox="0 0 24 24">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                    </svg>
                  )}
                  {item.icon === "refresh" && (
                    <svg className="text-signal-red h-12 w-12 fill-current" viewBox="0 0 24 24">
                      <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8A5.87 5.87 0 0 1 6 12c0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z" />
                    </svg>
                  )}
                  <span className="font-hero text-light-grey whitespace-pre-line text-center text-xs font-bold tracking-[0.2em] uppercase sm:text-sm">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal>
        <div className="px-4 sm:px-6 md:px-10 lg:px-16">
        <div ref={redContainerRef} className="bg-signal-red relative mx-auto mt-16 w-full max-w-[1400px] rounded-md px-3 py-2 sm:px-6 sm:py-4 lg:py-20 lg:px-12">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, #0A0A0A 1px, rgba(10,10,10,0.4) 1.5px, transparent 2px)",
              backgroundSize: "28px 28px",
              opacity: 0.3,
            }}
          />
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-8" style={{ perspective: "800px" }}>
            <div className="flex flex-col">
              <div className="relative mx-auto lg:mx-0" style={{ width: "min(360px, 75vw)" }}>
                <StickerPeel
                  imageSrc="/midRange.png"
                  rotate={-5}
                  width={280}
                  peelDirection={0}
                  initialPosition={{ x: 0, y: 0 }}
                  autoPeel
                />
              </div>
              <p
                className="font-hero font-bold text-center text-ink-black tracking-tight leading-none lg:text-left"
                style={{ fontSize: "clamp(1.5em, 5vw, 3.3em)", wordSpacing: "0em", marginTop: "0" }}
              >
                Top-tier style,<br />mid-range prices.
              </p>
            </div>
            <div ref={blackBoxRef} className="bg-ink-black min-h-[200px] w-full rounded-sm px-4 pt-5 pb-6 sm:min-h-[300px] lg:w-1/2 lg:px-8 lg:pt-6 lg:pb-8 lg:px-12" style={{ border: "5px solid #D8D8D6", transform: "rotate(6deg)", transformOrigin: "right center", marginTop: "clamp(1em, 3vw, 5em)" }}>
              <h3 className="font-hero font-bold text-signal-red mb-4 tracking-tight leading-none uppercase" style={{ fontSize: "clamp(1.3em, 3.5vw, 2.3em)", wordSpacing: "-0.05em" }}>
                India&apos;s Best Thrift<br />Marketplace
              </h3>
              <p className="text-light-grey mb-4 font-bold leading-tight" style={{ fontSize: "clamp(0.85em, 2vw, 1.2em)" }}>
                Welcome to MidRange – India&apos;s largest thrift marketplace where you can buy thrifted clothes and second hand fashion online. Discover vintage, affordable streetwear, Y2K fashion, and thrifted sneakers in one place.
              </p>
              <p className="text-steel-gray" style={{ fontSize: "1em" }}>
                Every item on our thrift marketplace India platform is quality-checked and authenticated. Join thousands choosing circular fashion – save money, reduce waste, and discover the best thrift marketplace in India for unique style.
              </p>
            </div>
          </div>
        </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
