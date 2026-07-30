"use client";

import { useRef, useState } from "react";

const magnifierCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 20 20'%3E%3Ccircle cx='9' cy='9' r='7' fill='none' stroke='white' stroke-width='1.5'/%3E%3Cline x1='9' y1='6' x2='9' y2='12' stroke='white' stroke-width='1.5'/%3E%3Cline x1='6' y1='9' x2='12' y2='9' stroke='white' stroke-width='1.5'/%3E%3Cline x1='14' y1='14' x2='19' y2='19' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") 2 2, zoom-in`;

interface ImagePanZoomProps {
  src: string;
  alt: string;
  className?: string;
  zoom?: number;
}

export function ImagePanZoom({ src, alt, className = "", zoom = 2 }: ImagePanZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [naturalRatio, setNaturalRatio] = useState<number | null>(null);

  function handleImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      setNaturalRatio(img.naturalWidth / img.naturalHeight);
    }
  }

  function getTranslate(e: React.MouseEvent) {
    const el = containerRef.current;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    const cx = e.clientX - rect.left - rect.width / 2;
    const cy = e.clientY - rect.top - rect.height / 2;
    return { x: cx * (1 - zoom), y: cy * (1 - zoom) };
  }

  function handleMouseEnter(e: React.MouseEvent) {
    setTranslate(getTranslate(e));
    setHovered(true);
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (hovered) setTranslate(getTranslate(e));
  }

  function handleMouseLeave() {
    setHovered(false);
    setTranslate({ x: 0, y: 0 });
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        cursor: hovered ? magnifierCursor : "default",
        ...(naturalRatio ? { aspectRatio: `${naturalRatio}` } : {}),
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="h-full w-full object-contain"
        onLoad={handleImageLoad}
        style={{
          transform: `scale(${hovered ? zoom : 1}) translate(${translate.x / zoom}px, ${translate.y / zoom}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />
    </div>
  );
}
