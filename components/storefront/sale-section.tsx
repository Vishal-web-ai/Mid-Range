"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SaleImage {
  imageUrl: string;
  altText: string;
}

const fallbackImages: SaleImage[] = [
  { imageUrl: "/sale-section/sale.png", altText: "₹200 off on orders above ₹2,000. Use code RangerOP" },
  { imageUrl: "/sale-section/free-shipping.png", altText: "Free shipping on your first order. Use code BecomeRanger" },
];

export default function SaleSection({ initialImages }: { initialImages?: SaleImage[] }) {
  const [saleImages, setSaleImages] = useState(initialImages && initialImages.length > 0 ? initialImages : fallbackImages);
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialImages) return;
    fetch("/api/sale-images")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const active = data.filter((i: { active: boolean }) => i.active);
          if (active.length > 0) setSaleImages(active.map((i: { imageUrl: string; altText: string }) => ({ imageUrl: i.imageUrl, altText: i.altText })));
        }
      })
      .catch(() => {});
  }, [initialImages]);

  useEffect(() => {
    const section = sectionRef.current;
    const leftCard = leftCardRef.current;
    const rightCard = rightCardRef.current;
    const bg = bgRef.current;
    if (!section || !leftCard || !rightCard || !bg) return;

    const ctx = gsap.context(() => {
      gsap.set(leftCard, { x: "-80vw", opacity: 0, scale: 0.8, rotateY: 0 });
      gsap.set(rightCard, { x: "80vw", opacity: 0, scale: 0.8, rotateY: 0 });
      gsap.set(bg, { y: "30%" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=200%",
          scrub: 3,
          pin: true,
        },
      });

      tl.to(bg, { y: "-30%", duration: 1, ease: "none" }, 0);
      tl.to(leftCard, { x: 0, opacity: 1, scale: 1, rotateY: 30, duration: 0.35, ease: "none" }, 0);
      tl.to(rightCard, { x: 0, opacity: 1, scale: 1, rotateY: -30, duration: 0.35, ease: "none" }, 0);
      tl.to(leftCard, { rotateY: 30, duration: 0.4, ease: "none" }, 0.35);
      tl.to(rightCard, { rotateY: -30, duration: 0.4, ease: "none" }, 0.35);
      tl.to(leftCard, { rotateY: 0, duration: 0.1, ease: "none" }, 0.75);
      tl.to(rightCard, { rotateY: 0, duration: 0.1, ease: "none" }, 0.75);
      tl.to(leftCard, { x: "-80vw", opacity: 0, scale: 0.8, duration: 0.15, ease: "none" }, 0.85);
      tl.to(rightCard, { x: "80vw", opacity: 0, scale: 0.8, duration: 0.15, ease: "none" }, 0.85);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 sm:py-24">
      <div
        ref={bgRef}
        className="absolute inset-0 -top-[30%] -bottom-[30%]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(225, 29, 46, 0.08) 0%, transparent 70%)",
        }}
      />
      <div className="container-wide relative z-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-stretch sm:justify-center sm:gap-8" style={{ perspective: "1200px" }}>
          {saleImages.slice(0, 2).map((img, i) => (
            <div
              key={i}
              ref={i === 0 ? leftCardRef : rightCardRef}
              className={`w-full max-w-[350px] rounded-2xl overflow-hidden flex items-center justify-center ${i === 0 ? "border-2 border-white" : ""}`}
              style={{ transformOrigin: i === 0 ? "left center" : "right center" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.imageUrl}
                alt={img.altText}
                className="w-full h-auto rounded-2xl object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
