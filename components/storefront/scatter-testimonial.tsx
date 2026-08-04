"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { isLowEndDevice } from "@/lib/device-capabilities";
import ProductImageLightbox from "@/components/storefront/product-image-lightbox";

gsap.registerPlugin(ScrollTrigger);

interface TestimonialData {
  name: string;
  avatar: string;
  rating: number;
  text: string;
  cardClass: string;
  verifiedColor: string;
  desktop: { top: string; left: string };
  mobile: { top: string; left: string };
  rotation: string;
  avatarBg: string;
  zIndex: number;
  imageUrl?: string | null;
  photos?: string[];
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="mb-3 flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="h-3.5 w-3.5 fill-[#FFC107]" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const scatterPositions = [
  { desktop: { top: "8%", left: "8%" }, mobile: { top: "30px", left: "calc(50% - 130px)" }, rotation: "-rotate-[4deg]", avatarBg: "bg-ink-black", cardClass: "bg-signal-red text-ink-black", verifiedColor: "text-ink-black/60", zIndex: 10 },
  { desktop: { top: "3%", left: "38%" }, mobile: { top: "150px", left: "calc(50% - 60px)" }, rotation: "rotate-[3deg]", avatarBg: "bg-signal-red", cardClass: "bg-white text-[#111111] border border-[#e5e5e5]", verifiedColor: "text-[#111111]/60", zIndex: 15 },
  { desktop: { top: "5%", left: "68%" }, mobile: { top: "280px", left: "calc(50% - 120px)" }, rotation: "-rotate-[2deg]", avatarBg: "bg-ink-black", cardClass: "bg-signal-red text-ink-black", verifiedColor: "text-ink-black/60", zIndex: 25 },
  { desktop: { top: "48%", left: "12%" }, mobile: { top: "400px", left: "calc(50% - 40px)" }, rotation: "rotate-[5deg]", avatarBg: "bg-signal-red", cardClass: "bg-white text-[#111111] border border-[#e5e5e5]", verifiedColor: "text-[#111111]/60", zIndex: 20 },
  { desktop: { top: "50%", left: "42%" }, mobile: { top: "520px", left: "calc(50% - 80px)" }, rotation: "-rotate-[1deg]", avatarBg: "bg-ink-black", cardClass: "bg-signal-red text-ink-black", verifiedColor: "text-ink-black/60", zIndex: 30 },
  { desktop: { top: "45%", left: "70%" }, mobile: { top: "640px", left: "calc(50% - 90px)" }, rotation: "rotate-[2deg]", avatarBg: "bg-signal-red", cardClass: "bg-white text-[#111111] border border-[#e5e5e5]", verifiedColor: "text-[#111111]/60", zIndex: 35 },
];

export default function ScatterTestimonial({ initialTestimonials }: { initialTestimonials?: Array<{ name: string; imageUrl?: string | null; photos?: string[]; text: string; rating: number }> }) {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>(() => {
    if (initialTestimonials && initialTestimonials.length > 0) {
      return initialTestimonials.map((t, i) => {
        const pos = scatterPositions[i % scatterPositions.length];
        return { name: t.name, avatar: t.name.charAt(0), rating: t.rating, text: t.text, imageUrl: t.imageUrl, photos: t.photos ?? [], ...pos };
      });
    }
    return [];
  });
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState<TestimonialData | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const cardBoundsRef = useRef<DOMRect | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const isNavRef = useRef(false);

  useEffect(() => {
    setPhotoIndex(0);
  }, [selectedIndex]);

  const prevPhoto = useCallback(() => {
    setPhotoIndex((p) => Math.max(0, p - 1));
  }, []);

  const nextPhoto = useCallback(() => {
    setPhotoIndex((p) => Math.min((selected?.photos?.length ?? 1) - 1, p + 1));
  }, [selected]);

  const photoTouchRef = useRef<number | null>(null);

  const handlePhotoTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    photoTouchRef.current = e.touches[0].clientX;
  }, []);

  const handlePhotoTouchMove = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
  }, []);

  const handlePhotoTouchEnd = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    const start = photoTouchRef.current;
    photoTouchRef.current = null;
    if (start === null) return;
    const dx = e.changedTouches[0].clientX - start;
    if (Math.abs(dx) < 40) return;
    setPhotoIndex((p) => {
      const photos = selected?.photos ?? [];
      if (photos.length < 2) return p;
      if (dx < 0) return Math.min(p + 1, photos.length - 1);
      return Math.max(p - 1, 0);
    });
  }, [selected]);

  const openCard = useCallback((t: TestimonialData, i: number) => {
    const card = cardRefs.current[i];
    if (!card) { setSelected(t); setSelectedIndex(i); return; }
    cardBoundsRef.current = card.getBoundingClientRect();
    isNavRef.current = false;
    setSelected(t);
    setSelectedIndex(i);
  }, []);

  const hoverTweenRef = useRef<gsap.core.Tween | null>(null);

  const handleHoverEnter = useCallback((i: number) => {
    const card = cardRefs.current[i];
    if (!card) return;
    hoverTweenRef.current?.kill();
    hoverTweenRef.current = gsap.to(card, {
      scale: 1.08,
      rotation: 0,
      zIndex: 50,
      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)",
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  const handleHoverLeave = useCallback((i: number) => {
    const card = cardRefs.current[i];
    if (!card) return;
    hoverTweenRef.current?.kill();
    const style = isMobile ? testimonials[i].mobile : testimonials[i].desktop;
    const rotationMatch = testimonials[i].rotation.match(/-?\[([^\]]+)\]/);
    const rotationDeg = rotationMatch ? parseFloat(rotationMatch[1]) * (testimonials[i].rotation.startsWith("-") ? -1 : 1) : 0;
    hoverTweenRef.current = gsap.to(card, {
      scale: 1,
      rotation: rotationDeg,
      zIndex: testimonials[i].zIndex,
      boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)",
      duration: 0.3,
      ease: "power2.out",
    });
  }, [isMobile, testimonials]);

  const goTo = useCallback((i: number) => {
    const t = testimonials[i];
    if (!t) return;
    isNavRef.current = true;
    if (popupRef.current) {
      gsap.to(popupRef.current.querySelector(".popup-content"), {
        opacity: 0, x: 0, duration: 0.15, onComplete: () => {
          setSelectedIndex(i);
          setSelected(t);
        }
      });
    } else {
      setSelectedIndex(i);
      setSelected(t);
    }
  }, [testimonials]);

  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const swipeActiveRef = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    swipeStartRef.current = { x: t.clientX, y: t.clientY };
    swipeActiveRef.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!swipeStartRef.current || !popupRef.current) return;
    const t = e.touches[0];
    const dx = t.clientX - swipeStartRef.current.x;
    const dy = t.clientY - swipeStartRef.current.y;
    if (!swipeActiveRef.current) {
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
        swipeActiveRef.current = true;
      } else {
        return;
      }
    }
    const content = popupRef.current.querySelector(".popup-content") as HTMLElement | null;
    if (content) {
      gsap.set(content, { x: dx, opacity: Math.max(0.2, 1 - Math.abs(dx) / 600) });
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start || !popupRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const active = swipeActiveRef.current;
    swipeActiveRef.current = false;
    if (!active) return;
    const content = popupRef.current.querySelector(".popup-content") as HTMLElement | null;
    if (!content) return;
    const threshold = 60;
    if (dx < -threshold && selectedIndex < testimonials.length - 1) {
      gsap.to(content, { x: "-35%", opacity: 0, duration: 0.2, ease: "power2.in", onComplete: () => goTo(selectedIndex + 1) });
    } else if (dx > threshold && selectedIndex > 0) {
      gsap.to(content, { x: "35%", opacity: 0, duration: 0.2, ease: "power2.in", onComplete: () => goTo(selectedIndex - 1) });
    } else {
      gsap.to(content, { x: 0, opacity: 1, duration: 0.25, ease: "power2.out" });
    }
  }, [selectedIndex, testimonials.length, goTo]);

  const closeCard = useCallback(() => {
    if (tlRef.current) {
      tlRef.current.reverse();
      tlRef.current.eventCallback("onReverseComplete", () => {
        if (overlayRef.current) {
          overlayRef.current.style.visibility = "hidden";
          overlayRef.current.style.opacity = "0";
        }
        setSelected(null);
        tlRef.current = null;
      });
    } else {
      if (overlayRef.current) {
        overlayRef.current.style.visibility = "hidden";
        overlayRef.current.style.opacity = "0";
      }
      setSelected(null);
    }
  }, []);

  useEffect(() => {
    if (!selected || !overlayRef.current || !popupRef.current) return;

    const overlay = overlayRef.current;
    const popup = popupRef.current;
    const lowEnd = isLowEndDevice();

    if (isNavRef.current) {
      isNavRef.current = false;
      gsap.to(popup.querySelector(".popup-content"), { opacity: 1, duration: 0.25 });
      return;
    }

    const bounds = cardBoundsRef.current;
    if (!bounds) return;

    const cx = bounds.left + bounds.width / 2;
    const cy = bounds.top + bounds.height / 2;

    gsap.set(popup, {
      position: "fixed",
      top: cy, left: cx,
      xPercent: -50, yPercent: -50,
      width: bounds.width, height: bounds.height,
      margin: 0,
      transformOrigin: "center center",
      borderRadius: "20px", padding: "0",
      scale: 0.4, opacity: 0,
    });

    const tl = gsap.timeline({ onStart: () => { overlay.style.visibility = "visible"; } });
    gsap.set(popup.querySelector(".popup-content"), { x: 0 });
    tl.to(overlay, { opacity: 1, duration: 0.25 }, 0);
    tl.to(popup, {
      top: "50%", left: "50%",
      width: "100%", maxWidth: "448px", height: "auto",
      scale: 1, opacity: 1,
      padding: "1.5rem", borderRadius: "16px",
      duration: lowEnd ? 0.35 : 0.5,
      ease: lowEnd ? "power2.out" : "back.out(1.7)",
    }, 0);
    tl.to(popup.querySelector(".popup-content"), { opacity: 1, duration: 0.3 }, "-=0.15");

    tlRef.current = tl;

    return () => {
      if (isNavRef.current) return;
      tl.kill();
      tlRef.current = null;
      if (overlayRef.current) {
        overlayRef.current.style.visibility = "hidden";
        overlayRef.current.style.opacity = "0";
      }
    };
  }, [selected]);

  useEffect(() => {
    if (initialTestimonials && initialTestimonials.length > 0) return;
    const controller = new AbortController();
    fetch("/api/testimonials", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const active = data.filter((t: { active: boolean }) => t.active);
          if (active.length > 0) {
            setTestimonials(
              active.map((t: { name: string; imageUrl?: string | null; photos?: string[]; text: string; rating: number }, i: number) => {
                const pos = scatterPositions[i % scatterPositions.length];
                return {
                  name: t.name,
                  avatar: t.name.charAt(0),
                  rating: t.rating,
                  text: t.text,
                  imageUrl: t.imageUrl,
                  photos: t.photos ?? [],
                  ...pos,
                };
              })
            );
          }
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, [initialTestimonials]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasScattered = useRef(false);

  useEffect(() => {
    if (!sectionRef.current || !gridRef.current) return;

    let cancelled = false;
    let scatterTimeout: ReturnType<typeof setTimeout> | null = null;
    const lowEnd = isLowEndDevice();

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!cards.length) return;

      // Measure final positions from the actual scattered CSS values
      const gridRect = gridRef.current!.getBoundingClientRect();

      // Set initial stacked state: all cards centered with slight offset
      cards.forEach((card, i) => {
        gsap.set(card, {
          position: "absolute",
          top: "50%",
          left: "50%",
          xPercent: -50,
          yPercent: -50,
          x: (i - cards.length / 2) * 30,
          y: (i - cards.length / 2) * 25,
          rotation: (i - cards.length / 2) * 3,
          opacity: 1,
          scale: 1,
        });
      });

      // ScrollTrigger: when section center hits viewport center
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "center center",
        onEnter: () => {
          if (hasScattered.current || cancelled) return;
          hasScattered.current = true;

          scatterTimeout = setTimeout(() => {
            if (cancelled) return;
            cards.forEach((card, i) => {
              const style = isMobile ? testimonials[i].mobile : testimonials[i].desktop;
              const rotationMatch = testimonials[i].rotation.match(/-?\[([^\]]+)\]/);
              const rotationDeg = rotationMatch ? parseFloat(rotationMatch[1]) * (testimonials[i].rotation.startsWith("-") ? -1 : 1) : 0;

              gsap.to(card, {
                top: style.top,
                left: style.left,
                xPercent: 0,
                yPercent: 0,
                x: 0,
                y: 0,
                rotation: rotationDeg,
                opacity: 1,
                scale: 1,
                duration: lowEnd ? 0.5 : 0.8,
                ease: lowEnd ? "power2.out" : "back.out(1.4)",
                delay: i * (lowEnd ? 0.05 : 0.1),
              });
            });
          }, 200);
        },
      });
    }, sectionRef);

    return () => {
      cancelled = true;
      if (scatterTimeout) clearTimeout(scatterTimeout);
      ctx.revert();
    };
  }, [isMobile]);

  if (testimonials.length === 0) return null;

  return (
    <section ref={sectionRef} className="section-spacing !pb-0">
      <div className="container-wide">
        <ScrollReveal>
          <div className="mb-0">
            <h2 className="font-hero font-bold text-light-grey max-w-4xl text-3xl leading-[1.1] tracking-wide uppercase sm:text-5xl">
              What People say about{" "}
              <span className="text-signal-red">our services</span>
            </h2>
          </div>
        </ScrollReveal>

        <div
          ref={gridRef}
          className="relative mx-auto w-full rounded-2xl max-[426px]:pr-[50px] max-[321px]:pr-[60px]"
          style={{
            minHeight: isMobile ? "950px" : "750px",
            background: `
              linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            backgroundColor: "#0F0F0F",
          }}
        >
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={`
                ${t.cardClass}
                ${t.rotation}
                absolute
                w-[195px] max-[321px]:w-[140px] sm:w-[270px] md:w-[310px]
                rounded-[20px] p-5 sm:p-6 max-[321px]:p-3
                shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)]
                cursor-pointer
              `}
              onClick={() => openCard(t, i)}
              onMouseEnter={() => handleHoverEnter(i)}
              onMouseLeave={() => handleHoverLeave(i)}
              style={{ zIndex: t.zIndex }}
            >
              <StarRating count={t.rating} />

              {(t.photos ?? []).length > 0 && (
                <div className="mb-5 flex items-center gap-1.5 max-[321px]:mb-3">
                  {(t.photos ?? []).slice(0, 2).map((src, pi) => (
                    <div key={src} className="relative h-10 w-10 overflow-hidden rounded-md max-[321px]:h-8 max-[321px]:w-8 sm:h-12 sm:w-12">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`${t.name} review photo ${pi + 1}`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                    </div>
                  ))}
                  {(t.photos ?? []).length > 2 && (
                    <span className="text-[10px] font-semibold opacity-70">+{(t.photos ?? []).length - 2}</span>
                  )}
                </div>
              )}

              <p className="mb-5 max-[321px]:mb-3 text-[13px] font-medium leading-relaxed sm:text-[15px] max-[321px]:text-[11px]">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div
                  className={`${t.avatarBg} relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-[11px] font-bold text-white`}
                >
                  {t.imageUrl ? (
                    <img src={t.imageUrl} alt={t.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  ) : (
                    t.avatar
                  )}
                </div>
                <div className="flex flex-col">
                  <p className="text-xs font-semibold sm:text-sm">
                    {t.name}
                  </p>
                  <p
                    className={`${t.verifiedColor} text-[10px] tracking-[0.5px] uppercase`}
                  >
                    Verified Customer
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={overlayRef}
        className="fixed inset-0 z-[100] flex items-center justify-center"
        style={{ visibility: "hidden", opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/70" onClick={closeCard} />

        <div className="absolute top-1/2 left-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 sm:gap-4">
          {selectedIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); goTo(selectedIndex - 1); }}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white bg-black/40 text-white transition-opacity hover:opacity-70 sm:h-14 sm:w-14"
              aria-label="Previous"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 sm:h-7 sm:w-7">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}
          <div aria-hidden className="w-[min(448px,calc(100vw-9rem))]" />
          {selectedIndex < testimonials.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goTo(selectedIndex + 1); }}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white bg-black/40 text-white transition-opacity hover:opacity-70 sm:h-14 sm:w-14"
              aria-label="Next"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 sm:h-7 sm:w-7">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>

        <div
          ref={popupRef}
          className="relative"
          style={{ overflow: "hidden", touchAction: "pan-y" }}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {selected && (
            <>
              <button
                onClick={closeCard}
                className="absolute top-7 right-7 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-opacity hover:opacity-70"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-4 w-4">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <div className={`popup-content ${selected.cardClass} rounded-2xl`}>
                <div className="p-6 sm:p-8">
                  {(selected.photos ?? []).length > 0 && (
                    <div className="mb-6" onTouchStart={handlePhotoTouchStart} onTouchMove={handlePhotoTouchMove} onTouchEnd={handlePhotoTouchEnd}>
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-black">
                        <button
                          type="button"
                          onClick={() => setPhotoViewerOpen(true)}
                          className="block h-full w-full cursor-zoom-in"
                          aria-label="Open photo viewer"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={selected.photos![photoIndex]}
                            alt={`${selected.name} review photo ${photoIndex + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-contain"
                          />
                        </button>
                        {(selected.photos ?? []).length > 1 && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                              className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
                              aria-label="Previous photo"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
                                <polyline points="15 18 9 12 15 6" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                              className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
                              aria-label="Next photo"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
                                <polyline points="9 18 15 12 9 6" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                      {(selected.photos ?? []).length > 1 && (
                        <div className="mt-3 flex justify-center gap-1.5">
                          {selected.photos!.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setPhotoIndex(i)}
                              className={`h-1.5 rounded-full transition-all ${i === photoIndex ? "w-5 bg-ink-black" : "w-1.5 bg-ink-black/25"}`}
                              aria-label={`Photo ${i + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <StarRating count={selected.rating} />
                  <p className="mb-6 mt-4 text-sm leading-relaxed sm:text-base">
                    &ldquo;{selected.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className={`${selected.avatarBg} relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-bold text-white`}>
                      {selected.imageUrl ? (
                        <img src={selected.imageUrl} alt={selected.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                      ) : (
                        selected.avatar
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold">{selected.name}</p>
                      <p className={`${selected.verifiedColor} text-[10px] tracking-[0.5px] uppercase`}>
                        Verified Customer
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {photoViewerOpen && selected && (
            <ProductImageLightbox
              images={selected.photos ?? []}
              initialIndex={photoIndex}
              onClose={() => setPhotoViewerOpen(false)}
            />
          )}
        </div>
      </div>
    </section>
  );
}