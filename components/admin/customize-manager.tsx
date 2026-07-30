"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { ImageUpload } from "./image-upload";

interface CarouselImage {
  id: string;
  imageUrl: string;
  order: number;
  active: boolean;
}

interface SaleImage {
  id: string;
  imageUrl: string;
  altText: string;
  order: number;
  active: boolean;
}

interface Testimonial {
  id: string;
  name: string;
  imageUrl: string | null;
  text: string;
  rating: number;
  order: number;
  active: boolean;
}

interface Props {
  initialCarouselImages: CarouselImage[];
  initialSaleImages: SaleImage[];
  initialTestimonials: Testimonial[];
}

const INPUT =
  "w-full rounded border border-steel-gray bg-ink-black px-3 py-2 text-sm text-light-grey placeholder-steel-gray focus:border-signal-red focus:outline-none transition-colors";

export function CustomizeManager({
  initialCarouselImages,
  initialSaleImages,
  initialTestimonials,
}: Props) {
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>(initialCarouselImages);
  const [saleImages, setSaleImages] = useState<SaleImage[]>(initialSaleImages);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [isPending, startTransition] = useTransition();

  const [carouselForm, setCarouselForm] = useState({ imageUrl: "" });
  const [saleForm, setSaleForm] = useState({ imageUrl: "", altText: "" });
  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    imageUrl: "",
    text: "",
    rating: 5,
  });

  // --- Round Carousel CRUD ---
  async function createCarousel() {
    const res = await fetch("/api/round-carousel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: carouselForm.imageUrl, order: carouselImages.length }),
    });
    if (!res.ok) return;
    const created = await res.json();
    startTransition(() => {
      setCarouselImages((prev) => [...prev, created].sort((a, b) => a.order - b.order));
      setCarouselForm({ imageUrl: "" });
    });
  }

  async function deleteCarousel(id: string) {
    const res = await fetch(`/api/round-carousel/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    startTransition(() => setCarouselImages((prev) => prev.filter((i) => i.id !== id)));
  }

  async function toggleCarouselActive(id: string, active: boolean) {
    const res = await fetch(`/api/round-carousel/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    startTransition(() => setCarouselImages((prev) => prev.map((i) => (i.id === id ? updated : i))));
  }

  async function reorderCarousel(id: string, newOrder: number) {
    const res = await fetch(`/api/round-carousel/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: newOrder }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    startTransition(() => {
      setCarouselImages((prev) =>
        prev.map((i) => (i.id === id ? updated : i)).sort((a, b) => a.order - b.order)
      );
    });
  }

  // --- Sale Images CRUD ---
  async function createSale() {
    const res = await fetch("/api/sale-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: saleForm.imageUrl, altText: saleForm.altText, order: saleImages.length }),
    });
    if (!res.ok) return;
    const created = await res.json();
    startTransition(() => {
      setSaleImages((prev) => [...prev, created].sort((a, b) => a.order - b.order));
      setSaleForm({ imageUrl: "", altText: "" });
    });
  }

  async function deleteSale(id: string) {
    const res = await fetch(`/api/sale-images/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    startTransition(() => setSaleImages((prev) => prev.filter((i) => i.id !== id)));
  }

  async function toggleSaleActive(id: string, active: boolean) {
    const res = await fetch(`/api/sale-images/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    startTransition(() => setSaleImages((prev) => prev.map((i) => (i.id === id ? updated : i))));
  }

  async function reorderSale(id: string, newOrder: number) {
    const res = await fetch(`/api/sale-images/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: newOrder }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    startTransition(() => {
      setSaleImages((prev) =>
        prev.map((i) => (i.id === id ? updated : i)).sort((a, b) => a.order - b.order)
      );
    });
  }

  // --- Testimonials CRUD ---
  async function createTestimonial() {
    const res = await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...testimonialForm, order: testimonials.length }),
    });
    if (!res.ok) return;
    const created = await res.json();
    startTransition(() => {
      setTestimonials((prev) => [...prev, created].sort((a, b) => a.order - b.order));
      setTestimonialForm({ name: "", imageUrl: "", text: "", rating: 5 });
    });
  }

  async function deleteTestimonial(id: string) {
    const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    startTransition(() => setTestimonials((prev) => prev.filter((i) => i.id !== id)));
  }

  async function toggleTestimonialActive(id: string, active: boolean) {
    const res = await fetch(`/api/testimonials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    startTransition(() => setTestimonials((prev) => prev.map((i) => (i.id === id ? updated : i))));
  }

  async function reorderTestimonial(id: string, newOrder: number) {
    const res = await fetch(`/api/testimonials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: newOrder }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    startTransition(() => {
      setTestimonials((prev) =>
        prev.map((i) => (i.id === id ? updated : i)).sort((a, b) => a.order - b.order)
      );
    });
  }

  return (
    <div className="space-y-12">
      {/* ======================== ROUND CAROUSEL ======================== */}
      <section>
        <h2 className="font-hero text-xl font-bold text-signal-red mb-6">
          Round Carousel Images
        </h2>

        <div className="rounded border border-steel-gray bg-dark-grey p-4">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="shrink-0 sm:w-[200px]">
              <label className="text-light-grey mb-1 block text-xs font-medium">Upload Image</label>
              <ImageUpload
                value={carouselForm.imageUrl}
                onChange={(url) => setCarouselForm((f) => ({ ...f, imageUrl: url }))}
              />
              <button
                onClick={createCarousel}
                disabled={isPending || !carouselForm.imageUrl || carouselImages.length >= 10}
                className="btn-primary mt-3 w-full disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add Image
              </button>
            </div>
            <div className="flex-1">
              <p className="text-light-grey mb-2 text-xs font-medium text-center">Uploaded Images ({carouselImages.length}/10)</p>
              {carouselImages.length === 0 ? (
                <p className="text-sm text-steel-gray text-center py-8">No images yet. Upload one on the left.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                  {carouselImages.map((img) => (
                    <div key={img.id} className="group relative">
                      <div className="relative aspect-square overflow-hidden rounded border border-steel-gray bg-ink-black">
                        <Image src={img.imageUrl} alt="Carousel" fill className="object-cover" unoptimized />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center gap-1 rounded bg-ink-black/70 opacity-0 transition-opacity group-hover:opacity-100">
                        <button onClick={() => toggleCarouselActive(img.id, img.active)} disabled={isPending}
                          className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors ${img.active ? "bg-green-500/20 text-green-400" : "bg-steel-gray/20 text-light-grey"}`}>
                          {img.active ? "On" : "Off"}
                        </button>
                        <button onClick={() => reorderCarousel(img.id, Math.max(0, img.order - 1))} disabled={isPending || img.order === 0}
                          className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-light-grey hover:bg-white/20 disabled:opacity-30">&#9650;</button>
                        <button onClick={() => reorderCarousel(img.id, img.order + 1)} disabled={isPending}
                          className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-light-grey hover:bg-white/20">&#9660;</button>
                        <button onClick={() => deleteCarousel(img.id)} disabled={isPending}
                          className="rounded bg-signal-red/20 px-1.5 py-0.5 text-[10px] text-signal-red hover:bg-signal-red/40">X</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ======================== SALE SECTION ======================== */}
      <section>
        <h2 className="font-hero text-xl font-bold text-signal-red mb-6">
          Sale Section Images
        </h2>

        <div className="rounded border border-steel-gray bg-dark-grey p-4">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="shrink-0 sm:w-[200px]">
              <label className="text-light-grey mb-1 block text-xs font-medium">Upload Image</label>
              <ImageUpload
                value={saleForm.imageUrl}
                onChange={(url) => setSaleForm((f) => ({ ...f, imageUrl: url }))}
              />
              <input
                placeholder="Alt text (e.g. ₹200 off)"
                value={saleForm.altText}
                onChange={(e) => setSaleForm((f) => ({ ...f, altText: e.target.value }))}
                className={`${INPUT} mt-3`}
              />
              <button
                onClick={createSale}
                disabled={isPending || !saleForm.imageUrl || saleImages.length >= 4}
                className="btn-primary mt-3 w-full disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add Image
              </button>
            </div>
            <div className="flex-1">
              <p className="text-light-grey mb-2 text-xs font-medium text-center">Uploaded Images ({saleImages.length}/4)</p>
              {saleImages.length === 0 ? (
                <p className="text-sm text-steel-gray text-center py-8">No images yet. Upload one on the left.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {saleImages.map((img) => (
                    <div key={img.id} className="group relative">
                      <div className="relative aspect-square overflow-hidden rounded border border-steel-gray bg-ink-black">
                        <Image src={img.imageUrl} alt={img.altText} fill className="object-cover" unoptimized />
                      </div>
                      <p className="text-[10px] text-steel-gray truncate mt-1">{img.altText || "No alt"}</p>
                      <div className="absolute top-0 right-0 flex items-center gap-1 rounded-bl bg-ink-black/70 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button onClick={() => toggleSaleActive(img.id, img.active)} disabled={isPending}
                          className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors ${img.active ? "bg-green-500/20 text-green-400" : "bg-steel-gray/20 text-light-grey"}`}>
                          {img.active ? "On" : "Off"}
                        </button>
                        <button onClick={() => reorderSale(img.id, Math.max(0, img.order - 1))} disabled={isPending || img.order === 0}
                          className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-light-grey hover:bg-white/20 disabled:opacity-30">&#9650;</button>
                        <button onClick={() => reorderSale(img.id, img.order + 1)} disabled={isPending}
                          className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-light-grey hover:bg-white/20">&#9660;</button>
                        <button onClick={() => deleteSale(img.id)} disabled={isPending}
                          className="rounded bg-signal-red/20 px-1.5 py-0.5 text-[10px] text-signal-red hover:bg-signal-red/40">X</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ======================== TESTIMONIALS ======================== */}
      <section>
        <h2 className="font-hero text-xl font-bold text-signal-red mb-6">
          Testimonials
        </h2>

        <div className="rounded border border-steel-gray bg-dark-grey p-4">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="shrink-0 sm:w-[200px] space-y-3">
              <label className="text-light-grey block text-xs font-medium">Avatar Image</label>
              <ImageUpload
                value={testimonialForm.imageUrl}
                onChange={(url) => setTestimonialForm((f) => ({ ...f, imageUrl: url }))}
              />
              <input
                placeholder="Customer name *"
                value={testimonialForm.name}
                onChange={(e) => setTestimonialForm((f) => ({ ...f, name: e.target.value }))}
                className={INPUT}
              />
              <textarea
                placeholder="Review text *"
                value={testimonialForm.text}
                onChange={(e) => setTestimonialForm((f) => ({ ...f, text: e.target.value }))}
                className={`${INPUT} min-h-[60px]`}
              />
              <select
                value={testimonialForm.rating}
                onChange={(e) => setTestimonialForm((f) => ({ ...f, rating: parseInt(e.target.value) }))}
                className={INPUT}
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>
                ))}
              </select>
              <button
                onClick={createTestimonial}
                disabled={isPending || !testimonialForm.name || !testimonialForm.text || testimonials.length >= 10}
                className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add Testimonial
              </button>
            </div>
            <div className="flex-1">
              <p className="text-light-grey mb-2 text-xs font-medium text-center">All Testimonials ({testimonials.length}/10)</p>
              {testimonials.length === 0 ? (
                <p className="text-sm text-steel-gray text-center py-8">No testimonials yet. Add one on the left.</p>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {testimonials.map((t) => (
                    <div key={t.id} className="group relative flex items-center gap-3 rounded border border-steel-gray bg-ink-black p-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-steel-gray bg-dark-grey">
                        {t.imageUrl ? (
                          <Image src={t.imageUrl} alt={t.name} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs font-bold text-white">
                            {t.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-light-grey truncate">{t.name}</p>
                        <p className="text-[10px] text-steel-gray truncate">{t.text}</p>
                        <p className="text-[10px] text-steel-gray">{"★".repeat(t.rating)}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button onClick={() => toggleTestimonialActive(t.id, t.active)} disabled={isPending}
                          className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors ${t.active ? "bg-green-500/20 text-green-400" : "bg-steel-gray/20 text-light-grey"}`}>
                          {t.active ? "On" : "Off"}
                        </button>
                        <button onClick={() => reorderTestimonial(t.id, Math.max(0, t.order - 1))} disabled={isPending || t.order === 0}
                          className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-light-grey hover:bg-white/20 disabled:opacity-30">&#9650;</button>
                        <button onClick={() => reorderTestimonial(t.id, t.order + 1)} disabled={isPending}
                          className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-light-grey hover:bg-white/20">&#9660;</button>
                        <button onClick={() => deleteTestimonial(t.id)} disabled={isPending}
                          className="rounded bg-signal-red/20 px-1.5 py-0.5 text-[10px] text-signal-red hover:bg-signal-red/40">X</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
