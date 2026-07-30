"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

export default function ProductImageLightbox({ images = [], initialIndex = 0, onClose }) {
  const [openIndex, setOpenIndex] = useState(initialIndex);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [slideDir, setSlideDir] = useState(0);
  const [imgKey, setImgKey] = useState(0);
  const isOpen = openIndex !== null && openIndex !== undefined;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && mounted) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen, mounted]);

  const close = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 500);
  }, [onClose]);

  const prev = useCallback(() => {
    setSlideDir(-1);
    setImgKey((k) => k + 1);
    setOpenIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const next = useCallback(() => {
    setSlideDir(1);
    setImgKey((k) => k + 1);
    setOpenIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, prev, next]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
      role="dialog"
      aria-modal="true"
      onClick={close}
    >
      <button
        onClick={close}
        aria-label="Close"
        className={`absolute top-4 right-4 z-10 p-2 text-signal-red hover:text-signal-red/70 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          aria-label="Previous image"
          className={`absolute left-2 top-1/2 -translate-y-1/2 text-signal-red hover:text-signal-red/70 transition-all duration-500 z-10 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      <img
        key={imgKey}
        src={images[openIndex]}
        alt={`Product view ${openIndex + 1}`}
        onClick={(e) => e.stopPropagation()}
        className={`h-screen w-[80vw] object-contain select-none animate-slide-in`}
        style={{ "--slide-dir": slideDir }}
        draggable={false}
      />

      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          aria-label="Next image"
          className={`absolute right-2 top-1/2 -translate-y-1/2 text-signal-red hover:text-signal-red/70 transition-all duration-500 z-10 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {images.length > 1 && (
        <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setOpenIndex(i); setImgKey((k) => k + 1); setSlideDir(i > openIndex ? 1 : -1); }}
              aria-label={`Go to image ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === openIndex ? "w-6 bg-white" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}
