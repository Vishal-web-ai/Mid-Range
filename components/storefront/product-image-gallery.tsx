"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePanZoom } from "@/components/storefront/image-magnifier";
import ProductImageLightbox from "./product-image-lightbox";
import { getMediumUrl, getThumbnailUrl } from "@/lib/cloudinary-utils";

interface Props {
  images: string[];
  title: string;
}

export default function ProductImageGallery({ images, title }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const mainImage = images[selectedIndex] ?? "/placeholder.png";

  function prev() {
    setSelectedIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }

  function next() {
    setSelectedIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="block w-full cursor-zoom-in"
          aria-label="Open image viewer"
        >
          <ImagePanZoom
            src={getMediumUrl(mainImage)}
            alt={title}
            className="bg-dark-grey rounded-lg overflow-hidden"
            zoom={2}
          >
            {images.length > 1 && (
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
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`bg-dark-grey relative aspect-square overflow-hidden rounded transition-all ${
                i === selectedIndex
                  ? "ring-2 ring-signal-red"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={getThumbnailUrl(src)}
                alt={`${title} ${i + 1}`}
                fill
                sizes="25vw"
                className="object-cover"
                loading={Math.abs(i - selectedIndex) <= 2 ? "eager" : "lazy"}
              />
            </button>
          ))}
        </div>
      )}

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
