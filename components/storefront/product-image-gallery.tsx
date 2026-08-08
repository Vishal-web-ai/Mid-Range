"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePanZoom } from "@/components/storefront/image-magnifier";
import ProductImageLightbox from "./product-image-lightbox";
import { getMediumUrl, getThumbnailUrl } from "@/lib/cloudinary-utils";

interface Props {
  images: string[];
  title: string;
  tag?: string | null;
  video?: string | null;
}

type Slide = { type: "image" | "video"; src: string };

function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  }

  return (
    <div className="bg-dark-grey mx-auto relative aspect-square w-full max-w-[min(100%,75vh)] overflow-hidden rounded-lg">
      <video
        ref={videoRef}
        src={src}
        playsInline
        preload="metadata"
        className="h-full w-full object-contain"
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {!playing && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Play video"
          className="bg-ink-black/60 hover:bg-ink-black/80 absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full text-white transition-all hover:scale-110"
        >
          <svg className="ml-1 h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default function ProductImageGallery({ images, title, tag, video }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const slides: Slide[] = [
    ...images.map((src) => ({ type: "image" as const, src })),
    ...(video ? [{ type: "video" as const, src: video }] : []),
  ];

  const slide = slides[selectedIndex] ?? slides[0];
  const isVideoSlide = slide?.type === "video";
  const showNav = slides.length > 1;

  function prev() {
    setSelectedIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
  }

  function next() {
    setSelectedIndex((i) => (i === slides.length - 1 ? 0 : i + 1));
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 50) return;
    if (delta > 0) prev();
    else next();
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:gap-3">
        <div
          className="relative order-1 md:order-2 md:flex-1"
          onTouchStart={showNav ? handleTouchStart : undefined}
          onTouchEnd={showNav ? handleTouchEnd : undefined}
        >
          {isVideoSlide ? (
            <VideoPlayer src={slide.src} />
          ) : (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="block w-full cursor-zoom-in"
              aria-label="Open image viewer"
            >
              <ImagePanZoom
                src={getMediumUrl(slide.src)}
                alt={title}
                className="bg-dark-grey rounded-lg overflow-hidden"
                zoom={2}
              >
                {tag && (
                  <span className="bg-signal-red text-ink-black absolute top-2 left-2 z-10 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                    {tag}
                  </span>
                )}
                {showNav && (
                  <>
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label="Previous image"
                      onClick={(e) => { e.stopPropagation(); prev(); }}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); prev(); } }}
                      className="absolute top-1/2 left-2 z-10 hidden -translate-y-1/2 cursor-pointer items-center justify-center text-signal-red transition-colors hover:text-signal-red/70 select-none sm:flex"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label="Next image"
                      onClick={(e) => { e.stopPropagation(); next(); }}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); next(); } }}
                      className="absolute top-1/2 right-2 z-10 hidden -translate-y-1/2 cursor-pointer items-center justify-center text-signal-red transition-colors hover:text-signal-red/70 select-none sm:flex"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </>
                )}
              </ImagePanZoom>
            </button>
          )}
        </div>
        {showNav && (
          <div className="order-2 mt-3 grid grid-cols-4 gap-2 md:order-1 md:mt-[3em] md:flex md:w-[84px] md:shrink-0 md:flex-col md:gap-2">
            {slides.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedIndex(i)}
                className={`bg-dark-grey relative aspect-square overflow-hidden rounded transition-all ${
                  i === selectedIndex
                    ? "ring-2 ring-signal-red"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                {s.type === "image" ? (
                  <Image
                    src={getThumbnailUrl(s.src)}
                    alt={`${title} ${i + 1}`}
                    fill
                    sizes="25vw"
                    className="object-cover"
                    loading={Math.abs(i - selectedIndex) <= 2 ? "eager" : "lazy"}
                  />
                ) : (
                  <>
                    <Image
                      src={getThumbnailUrl(images[0] ?? "/placeholder.png")}
                      alt={`${title} video`}
                      fill
                      sizes="25vw"
                      className="object-cover"
                    />
                    <span className="bg-ink-black/50 absolute inset-0 flex items-center justify-center">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <ProductImageLightbox
          images={images}
          initialIndex={selectedIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
