"use client";

import { useRef, useEffect, useMemo, type CSSProperties } from "react";
import { gsap } from "gsap";

interface StickerPeelProps {
  imageSrc: string;
  rotate?: number;
  peelBackHoverPct?: number;
  peelBackActivePct?: number;
  peelEasing?: string;
  peelHoverEasing?: string;
  width?: number;
  shadowIntensity?: number;
  lightingIntensity?: number;
  initialPosition?: "center" | "random" | { x: number; y: number };
  peelDirection?: number;
  autoPeel?: boolean;
  className?: string;
}

interface CSSVars extends CSSProperties {
  "--sticker-rotate"?: string;
  "--sticker-p"?: string;
  "--sticker-peelback-hover"?: string;
  "--sticker-peelback-active"?: string;
  "--sticker-peel-easing"?: string;
  "--sticker-peel-hover-easing"?: string;
  "--sticker-width"?: string;
  "--sticker-shadow-opacity"?: number;
  "--sticker-lighting-constant"?: number;
  "--peel-direction"?: string;
  "--sticker-start"?: string;
  "--sticker-end"?: string;
}

const StickerPeel: React.FC<StickerPeelProps> = ({
  imageSrc,
  rotate = 30,
  peelBackHoverPct = 30,
  peelBackActivePct = 40,
  peelEasing = "power3.out",
  peelHoverEasing = "power2.out",
  width = 200,
  shadowIntensity = 0.6,
  lightingIntensity = 0.1,
  initialPosition = "center",
  peelDirection = 0,
  autoPeel = false,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointLightRef = useRef<SVGFEPointLightElement>(null);
  const pointLightFlippedRef = useRef<SVGFEPointLightElement>(null);

  const defaultPadding = 12;

  useEffect(() => {
    const updateLight = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = mouseEvent.clientX - rect.left;
      const y = mouseEvent.clientY - rect.top;

      if (pointLightRef.current) {
        gsap.set(pointLightRef.current, { attr: { x, y } });
      }

      const normalizedAngle = Math.abs(peelDirection % 360);
      if (pointLightFlippedRef.current) {
        if (normalizedAngle !== 180) {
          gsap.set(pointLightFlippedRef.current, { attr: { x, y: rect.height - y } });
        } else {
          gsap.set(pointLightFlippedRef.current, { attr: { x: -1000, y: -1000 } });
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", updateLight);
      return () => container.removeEventListener("mousemove", updateLight);
    }
  }, [peelDirection]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = () => container.classList.add("touch-active");
    const handleTouchEnd = () => container.classList.remove("touch-active");

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    if (!autoPeel) return;
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          container.classList.add("peeled");
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [autoPeel]);

  const cssVars: CSSVars = useMemo(
    () => ({
      "--sticker-rotate": `${rotate}deg`,
      "--sticker-p": `${defaultPadding}px`,
      "--sticker-peelback-hover": `${peelBackHoverPct}%`,
      "--sticker-peelback-active": `${peelBackActivePct}%`,
      "--sticker-peel-easing": peelEasing,
      "--sticker-peel-hover-easing": peelHoverEasing,
      "--sticker-width": `${width}px`,
      "--sticker-shadow-opacity": shadowIntensity,
      "--sticker-lighting-constant": lightingIntensity,
      "--peel-direction": `${peelDirection}deg`,
      "--sticker-start": `calc(-1 * ${defaultPadding}px)`,
      "--sticker-end": `calc(100% + ${defaultPadding}px)`,
    }),
    [rotate, peelBackHoverPct, peelBackActivePct, peelEasing, peelHoverEasing, width, shadowIntensity, lightingIntensity, peelDirection],
  );

  const stickerMainStyle: CSSProperties = {
    clipPath: `polygon(var(--sticker-start) var(--sticker-start), var(--sticker-end) var(--sticker-start), var(--sticker-end) var(--sticker-end), var(--sticker-start) var(--sticker-end))`,
    transition: "clip-path 0.6s ease-out",
    filter: "url(#dropShadow)",
    willChange: "clip-path, transform",
  };

  const flapStyle: CSSProperties = {
    clipPath: `polygon(var(--sticker-start) var(--sticker-start), var(--sticker-end) var(--sticker-start), var(--sticker-end) var(--sticker-start), var(--sticker-start) var(--sticker-start))`,
    top: `calc(-100% - var(--sticker-p) - var(--sticker-p))`,
    transform: "scaleY(-1)",
    transition: "all 0.6s ease-out",
    willChange: "clip-path, transform",
  };

  const imageStyle: CSSProperties = {
    transform: `rotate(calc(${rotate}deg - ${peelDirection}deg))`,
    width: `${width}px`,
  };

  const shadowImageStyle: CSSProperties = {
    ...imageStyle,
    filter: "url(#expandAndFill)",
  };

  return (
    <div
      className={`relative ${className}`}
      style={cssVars}
    >
      <svg width="0" height="0">
        <defs>
          <filter id="pointLight">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feSpecularLighting result="spec" in="blur" specularExponent="100" specularConstant={lightingIntensity} lightingColor="white">
              <fePointLight ref={pointLightRef} x="100" y="100" z="300" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceGraphic" result="lit" />
            <feComposite in="lit" in2="SourceAlpha" operator="in" />
          </filter>

          <filter id="pointLightFlipped">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feSpecularLighting result="spec" in="blur" specularExponent="100" specularConstant={lightingIntensity * 7} lightingColor="white">
              <fePointLight ref={pointLightFlippedRef} x="100" y="100" z="300" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceGraphic" result="lit" />
            <feComposite in="lit" in2="SourceAlpha" operator="in" />
          </filter>

          <filter id="dropShadow">
            <feDropShadow dx="2" dy="4" stdDeviation={3 * shadowIntensity} floodColor="black" floodOpacity={shadowIntensity} />
          </filter>

          <filter id="expandAndFill">
            <feOffset dx="0" dy="0" in="SourceAlpha" result="shape" />
            <feFlood floodColor="rgb(179,179,179)" result="flood" />
            <feComposite operator="in" in="flood" in2="shape" />
          </filter>
        </defs>
      </svg>

      <div
        className="sticker-container relative select-none touch-none sm:touch-auto"
        ref={containerRef}
        style={{
          WebkitUserSelect: "none",
          userSelect: "none",
          WebkitTouchCallout: "none",
          WebkitTapHighlightColor: "transparent",
          transform: `rotate(${peelDirection}deg)`,
          transformOrigin: "center",
        }}
      >
        <div className="sticker-main" style={stickerMainStyle}>
          <div style={{ filter: "url(#pointLight)" }}>
            <img src={imageSrc} alt="" className="block" style={imageStyle} draggable="false" onContextMenu={(e) => e.preventDefault()} />
          </div>
        </div>

        <div className="absolute top-4 left-2 w-full h-full opacity-40" style={{ filter: "brightness(0) blur(8px)" }}>
          <div className="sticker-flap" style={flapStyle}>
            <img src={imageSrc} alt="" className="block" style={shadowImageStyle} draggable="false" onContextMenu={(e) => e.preventDefault()} />
          </div>
        </div>

        <div className="sticker-flap absolute w-full h-full left-0" style={flapStyle}>
          <div style={{ filter: "url(#pointLightFlipped)" }}>
            <img src={imageSrc} alt="" className="block" style={shadowImageStyle} draggable="false" onContextMenu={(e) => e.preventDefault()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickerPeel;
