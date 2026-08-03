"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./pill-nav-links.css";

const menuItems = [
  { label: "Collections", href: "/collections" },
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "About Us", href: "/about" },
];

export default function PillNavLinks() {
  const pathname = usePathname();
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const tweenRefs = useRef<Array<gsap.core.Tween | null>>([]);
  const [isTablet, setIsTablet] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 768px) and (max-width: 800px)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (max-width: 800px)");
    const onChange = (e: MediaQueryListEvent) => setIsTablet(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const applyState = (i: number, active: boolean) => {
    const circle = circleRefs.current[i];
    if (!circle?.parentElement) return;
    const pill = circle.parentElement as HTMLElement;
    const h = pill.getBoundingClientRect().height;
    const label = pill.querySelector<HTMLElement>(".pill__label");
    const hover = pill.querySelector<HTMLElement>(".pill__label--hover");
    if (active) {
      gsap.set(circle, { scale: 1.2 });
      if (label) gsap.set(label, { y: -(h + 8) });
      if (hover) gsap.set(hover, { y: 0, opacity: 1 });
    } else {
      gsap.set(circle, { scale: 0 });
      if (label) gsap.set(label, { y: 0 });
      if (hover) gsap.set(hover, { y: h + 100, opacity: 0 });
    }
  };

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, i) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = (w * w / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${originY}px` });

        const label = pill.querySelector<HTMLElement>(".pill__label");
        const hover = pill.querySelector<HTMLElement>(".pill__label--hover");
        if (label) gsap.set(label, { y: 0 });
        if (hover) gsap.set(hover, { y: h + 100, opacity: 0 });

        tlRefs.current[i]?.kill();
        const tl = gsap.timeline({ paused: true });
        tl.to(
          circle,
          { scale: 1.2, xPercent: -50, duration: 2, ease: "power3.easeOut", overwrite: "auto" },
          0,
        );
        if (label) {
          tl.to(label, { y: -(h + 8), duration: 2, ease: "power3.easeOut", overwrite: "auto" }, 0);
        }
        if (hover) {
          tl.to(hover, { y: 0, opacity: 1, duration: 2, ease: "power3.easeOut", overwrite: "auto" }, 0);
        }
        tlRefs.current[i] = tl;

        applyState(i, isTablet && pathname === menuItems[i].href);
      });
    };

    layout();
    const onResize = () => layout();
    window.addEventListener("resize", onResize);
    if (document.fonts) document.fonts.ready.then(layout).catch(() => {});
    return () => window.removeEventListener("resize", onResize);
  }, [pathname, isTablet]);

  const handleEnter = (i: number) => {
    if (isTablet && pathname === menuItems[i].href) return;
    const tl = tlRefs.current[i];
    if (!tl) return;
    tweenRefs.current[i]?.kill();
    tweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease: "power3.easeOut",
      overwrite: "auto",
    });
  };

  const handleLeave = (i: number) => {
    if (isTablet && pathname === menuItems[i].href) return;
    const tl = tlRefs.current[i];
    if (!tl) return;
    tweenRefs.current[i]?.kill();
    tweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.25,
      ease: "power3.easeOut",
      overwrite: "auto",
    });
  };

  return (
    <div className="pill-nav">
      {menuItems.map((item, i) => {
        const isActive = pathname === item.href;
        return (
          <span key={item.href} className="pill-wrap">
            <Link
              href={item.href}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className="pill"
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={() => handleLeave(i)}
            >
              <span
                ref={(el) => {
                  circleRefs.current[i] = el;
                }}
                className="pill__circle"
                aria-hidden="true"
              />
              <span className="pill__labels">
                <span className="pill__label">{item.label}</span>
                <span className="pill__label--hover" aria-hidden="true">
                  {item.label}
                </span>
              </span>
            </Link>
          </span>
        );
      })}
    </div>
  );
}
