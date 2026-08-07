"use client";

import { useEffect, useRef, useState, useTransition, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { ImageUpload } from "./image-upload";
import { PhotoPicker } from "./photo-picker";
import { CustomSelect } from "./custom-select";

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
  photos: string[];
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

const DRAG_CARD =
  "relative cursor-grab active:cursor-grabbing touch-none select-none";

const X_BUTTON =
  "absolute top-1 right-1 z-10 rounded bg-ink-black/80 px-1.5 py-0.5 text-xs font-bold text-signal-red transition-colors hover:bg-signal-red hover:text-white disabled:opacity-40";

function reorderItems<T extends { id: string; order: number }>(
  items: T[],
  from: number,
  to: number
): T[] {
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next.map((item, index) => ({ ...item, order: index }));
}

function persistOrders(base: string, items: { id: string; order: number }[]) {
  for (const item of items) {
    fetch(`${base}/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: item.order }),
    }).catch(() => {});
  }
}

const DOUBLE_TAP_MS = 300;

function usePointerDrag(
  onReorder: (from: number, to: number) => void,
  onTap?: (index: number) => void
) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [armed, setArmed] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    dragIndex: number;
    overIndex: number;
    x: number;
    y: number;
    moved: boolean;
    armed: boolean;
  } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapRef = useRef<{ time: number; index: number } | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
  }, []);

  function clearTimers() {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    timerRef.current = null;
    tapTimerRef.current = null;
  }

  function onPointerDown(e: ReactPointerEvent, index: number) {
    clearTimers();
    if ((e.target as HTMLElement).closest("button")) return;
    const now = Date.now();
    const armNow =
      lastTapRef.current !== null &&
      now - lastTapRef.current.time <= DOUBLE_TAP_MS &&
      lastTapRef.current.index === index;
    if (armNow) {
      lastTapRef.current = null;
    } else {
      lastTapRef.current = { time: now, index };
      tapTimerRef.current = setTimeout(() => {
        lastTapRef.current = null;
      }, DOUBLE_TAP_MS);
    }

    dragRef.current = {
      pointerId: e.pointerId,
      dragIndex: index,
      overIndex: index,
      x: e.clientX,
      y: e.clientY,
      moved: false,
      armed: armNow,
    };
    setDragIndex(index);
    setOverIndex(index);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    if (armNow) setArmed(true);
  }

  function onPointerMove(e: ReactPointerEvent) {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.pointerId) return;
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 8) return;
    d.moved = true;
    e.preventDefault();
    if (!d.armed) {
      clearTimers();
      lastTapRef.current = null;
      return;
    }
    const card = (document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null)?.closest?.(
      "[data-reorder-card]"
    );
    const idx = Number((card as HTMLElement | null)?.dataset.index);
    if (!Number.isNaN(idx) && idx !== d.overIndex) {
      d.overIndex = idx;
      setOverIndex(idx);
    }
  }

  function onPointerUp(e: ReactPointerEvent) {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.pointerId) return;
    clearTimers();
    if (d.armed) {
      if (d.overIndex !== d.dragIndex) onReorder(d.dragIndex, d.overIndex);
      setArmed(false);
    } else if (!d.moved) {
      const index = d.dragIndex;
      if (onTap) {
        tapTimerRef.current = setTimeout(() => onTap(index), DOUBLE_TAP_MS + 20);
      }
    }
    dragRef.current = null;
    setDragIndex(null);
    setOverIndex(null);
  }

  function onPointerCancel(e: ReactPointerEvent) {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.pointerId) return;
    clearTimers();
    lastTapRef.current = null;
    setArmed(false);
    dragRef.current = null;
    setDragIndex(null);
    setOverIndex(null);
  }

  return { dragIndex, overIndex, armed, onPointerDown, onPointerMove, onPointerUp, onPointerCancel };
}

function dragClasses(armed: boolean, dragIndex: number | null, overIndex: number | null, index: number) {
  const isDragging = armed && dragIndex === index;
  const isTarget = armed && overIndex === index && dragIndex !== null && dragIndex !== index;
  return `${isDragging ? "z-50 ring-2 ring-light-grey shadow-2xl" : ""} ${isTarget ? "ring-2 ring-signal-red" : ""}`;
}

export function CustomizeManager({
  initialCarouselImages,
  initialSaleImages,
  initialTestimonials,
}: Props) {
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>(initialCarouselImages);
  const [saleImages, setSaleImages] = useState<SaleImage[]>(initialSaleImages);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [isPending, startTransition] = useTransition();

  const carouselDrag = usePointerDrag(reorderCarousel);
  const saleDrag = usePointerDrag(reorderSale);
  const testimonialDrag = usePointerDrag(reorderTestimonial, (index) =>
    editTestimonial(testimonials[index])
  );

  const [carouselPending, setCarouselPending] = useState<string[]>([]);
  const [carouselUploading, setCarouselUploading] = useState(false);
  const carouselFileRef = useRef<HTMLInputElement>(null);
  const [saleForm, setSaleForm] = useState({ imageUrl: "" });
  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    photos: [] as string[],
    text: "",
    rating: 5,
  });
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);

  // --- Round Carousel CRUD ---
  async function handleCarouselFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) return;
    setCarouselUploading(true);
    const urls: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) continue;
        const { url } = await res.json();
        if (url) urls.push(url);
      } catch {}
    }
    setCarouselUploading(false);
    if (urls.length) setCarouselPending((prev) => [...prev, ...urls]);
    if (carouselFileRef.current) carouselFileRef.current.value = "";
  }

  async function addCarouselPending() {
    if (carouselPending.length === 0) return;
    const urls = [...carouselPending];
    const created: CarouselImage[] = [];
    for (let i = 0; i < urls.length; i++) {
      const res = await fetch("/api/round-carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: urls[i], order: carouselImages.length + i }),
      });
      if (res.ok) created.push(await res.json());
    }
    if (created.length) {
      startTransition(() => {
        setCarouselImages((prev) => [...prev, ...created].sort((a, b) => a.order - b.order));
        setCarouselPending([]);
      });
    }
  }

  async function deleteCarousel(id: string) {
    const res = await fetch(`/api/round-carousel/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    startTransition(() => setCarouselImages((prev) => prev.filter((i) => i.id !== id)));
  }

  function reorderCarousel(from: number, to: number) {
    const next = reorderItems(carouselImages, from, to);
    startTransition(() => setCarouselImages(next));
    persistOrders("/api/round-carousel", next);
  }

  // --- Sale Images CRUD ---
  async function createSale() {
    const res = await fetch("/api/sale-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: saleForm.imageUrl, order: saleImages.length }),
    });
    if (!res.ok) return;
    const created = await res.json();
    startTransition(() => {
      setSaleImages((prev) => [...prev, created].sort((a, b) => a.order - b.order));
      setSaleForm({ imageUrl: "" });
    });
  }

  async function deleteSale(id: string) {
    const res = await fetch(`/api/sale-images/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    startTransition(() => setSaleImages((prev) => prev.filter((i) => i.id !== id)));
  }

  function reorderSale(from: number, to: number) {
    const next = reorderItems(saleImages, from, to);
    startTransition(() => setSaleImages(next));
    persistOrders("/api/sale-images", next);
  }

  // --- Testimonials CRUD ---
  function resetTestimonialForm() {
    setTestimonialForm({ name: "", photos: [], text: "", rating: 5 });
    setEditingTestimonialId(null);
  }

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
      resetTestimonialForm();
    });
  }

  async function updateTestimonial() {
    if (!editingTestimonialId) return;
    const res = await fetch(`/api/testimonials/${editingTestimonialId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testimonialForm),
    });
    if (!res.ok) return;
    const updated = await res.json();
    startTransition(() => {
      setTestimonials((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      resetTestimonialForm();
    });
  }

  function editTestimonial(t: Testimonial) {
    setEditingTestimonialId(t.id);
    setTestimonialForm({
      name: t.name,
      photos: t.photos ?? [],
      text: t.text,
      rating: t.rating,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteTestimonial(id: string) {
    const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    startTransition(() => setTestimonials((prev) => prev.filter((i) => i.id !== id)));
  }

  function reorderTestimonial(from: number, to: number) {
    const next = reorderItems(testimonials, from, to);
    startTransition(() => setTestimonials(next));
    persistOrders("/api/testimonials", next);
  }

  return (
    <div className="space-y-12">
      {(carouselDrag.armed || saleDrag.armed || testimonialDrag.armed) && (
        <div className="pointer-events-none fixed inset-0 z-40 bg-ink-black/60" aria-hidden="true" />
      )}
      {/* ======================== ROUND CAROUSEL ======================== */}
      <section>
        <h2 className="font-hero text-xl font-bold text-signal-red mb-6">
          Round Carousel Images
        </h2>

        <div className="rounded border border-steel-gray bg-dark-grey p-4">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="shrink-0 sm:w-[200px]">
              <label className="text-light-grey mb-1 block text-xs font-medium">Upload Images</label>
              <input
                ref={carouselFileRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleCarouselFiles}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => carouselFileRef.current?.click()}
                disabled={carouselUploading || isPending}
                className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded border-2 border-dashed border-steel-gray bg-ink-black transition-colors hover:border-signal-red/50 disabled:opacity-50"
              >
                {carouselUploading ? (
                  <>
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-steel-gray border-t-signal-red" />
                    <span className="text-steel-gray text-xs">Uploading...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-8 w-8 text-steel-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-steel-gray text-xs">Click to upload images</span>
                  </>
                )}
              </button>
              {carouselPending.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {carouselPending.map((url) => (
                    <div key={url} className="relative h-10 w-10 overflow-hidden rounded border border-steel-gray bg-ink-black">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setCarouselPending((prev) => prev.filter((u) => u !== url))}
                        aria-label="Remove pending image"
                        className="absolute top-0 right-0 rounded-bl bg-ink-black/80 px-1 text-[10px] font-bold text-signal-red transition-colors hover:bg-signal-red hover:text-white"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={addCarouselPending}
                disabled={isPending || carouselPending.length === 0 || carouselImages.length + carouselPending.length > 10}
                className="btn-primary mt-3 w-full disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add {carouselPending.length > 1 ? `${carouselPending.length} ` : ""}Image{carouselPending.length === 1 ? "" : "s"}
              </button>
            </div>
            <div className="flex-1">
              <p className="text-light-grey mb-2 text-xs font-medium text-center">Uploaded Images ({carouselImages.length}/10)</p>
              {carouselImages.length === 0 ? (
                <p className="text-sm text-steel-gray text-center py-8">No images yet. Upload one on the left.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                  {carouselImages.map((img, i) => (
                    <div
                      key={img.id}
                      data-reorder-card
                      data-index={i}
                      onPointerDown={(e) => carouselDrag.onPointerDown(e, i)}
                      onPointerMove={carouselDrag.onPointerMove}
                      onPointerUp={carouselDrag.onPointerUp}
                      onPointerCancel={carouselDrag.onPointerCancel}
                      onDragStart={(e) => e.preventDefault()}
                      className={`${DRAG_CARD} ${dragClasses(carouselDrag.armed, carouselDrag.dragIndex, carouselDrag.overIndex, i)}`}
                    >
                      <div className="relative aspect-square overflow-hidden rounded border border-steel-gray bg-ink-black">
                        <Image src={img.imageUrl} alt="Carousel" fill className="object-cover" unoptimized draggable={false} />
                      </div>
                      <button
                        onClick={() => deleteCarousel(img.id)}
                        disabled={isPending}
                        aria-label="Delete carousel image"
                        title="Delete"
                        className={X_BUTTON}
                      >
                        X
                      </button>
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
                  {saleImages.map((img, i) => (
                    <div
                      key={img.id}
                      data-reorder-card
                      data-index={i}
                      onPointerDown={(e) => saleDrag.onPointerDown(e, i)}
                      onPointerMove={saleDrag.onPointerMove}
                      onPointerUp={saleDrag.onPointerUp}
                      onPointerCancel={saleDrag.onPointerCancel}
                      onDragStart={(e) => e.preventDefault()}
                      className={`${DRAG_CARD} ${dragClasses(saleDrag.armed, saleDrag.dragIndex, saleDrag.overIndex, i)}`}
                    >
                      <div className="relative aspect-square overflow-hidden rounded border border-steel-gray bg-ink-black">
                        <Image src={img.imageUrl} alt={img.altText} fill className="object-cover" unoptimized draggable={false} />
                      </div>
                      <p className="text-[10px] text-steel-gray truncate mt-1">{img.altText || "No alt"}</p>
                      <button
                        onClick={() => deleteSale(img.id)}
                        disabled={isPending}
                        aria-label="Delete sale image"
                        title="Delete"
                        className={X_BUTTON}
                      >
                        X
                      </button>
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
              {editingTestimonialId && (
                <p className="rounded border border-signal-red/30 bg-signal-red/10 px-2 py-1 text-xs font-medium text-signal-red">
                  Editing testimonial
                </p>
              )}
              <label className="text-light-grey block text-xs font-medium">
                Review Photos ({testimonialForm.photos.length}/4)
              </label>
              <PhotoPicker
                photos={testimonialForm.photos}
                onChange={(photos) => setTestimonialForm((f) => ({ ...f, photos }))}
                max={4}
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
                className={`${INPUT} min-h-[60px] resize-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
              />
              <CustomSelect
                value={String(testimonialForm.rating)}
                onChange={(value) => setTestimonialForm((f) => ({ ...f, rating: parseInt(value) }))}
                options={[1, 2, 3, 4, 5].map((r) => ({ label: `${r} Star${r > 1 ? "s" : ""}`, value: String(r) }))}
              />
              <button
                onClick={editingTestimonialId ? updateTestimonial : createTestimonial}
                disabled={isPending || !testimonialForm.name || !testimonialForm.text || testimonials.length >= 10}
                className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {editingTestimonialId ? "Update Testimonial" : "Add Testimonial"}
              </button>
              {editingTestimonialId && (
                <button
                  onClick={resetTestimonialForm}
                  className="w-full rounded border border-steel-gray py-2 text-sm text-light-grey transition-colors hover:bg-white/5"
                >
                  Cancel
                </button>
              )}
            </div>
            <div className="flex-1">
              <p className="text-light-grey mb-2 text-xs font-medium text-center">All Testimonials ({testimonials.length}/10)</p>
              {testimonials.length === 0 ? (
                <p className="text-sm text-steel-gray text-center py-8">No testimonials yet. Add one on the left.</p>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {testimonials.map((t, i) => (
                    <div
                      key={t.id}
                      data-reorder-card
                      data-index={i}
                      onPointerDown={(e) => testimonialDrag.onPointerDown(e, i)}
                      onPointerMove={testimonialDrag.onPointerMove}
                      onPointerUp={testimonialDrag.onPointerUp}
                      onPointerCancel={testimonialDrag.onPointerCancel}
                      onDragStart={(e) => e.preventDefault()}
                      title="Double-click to drag, click to edit"
                      className={`relative cursor-pointer rounded border border-steel-gray bg-ink-black p-3 touch-none select-none ${dragClasses(testimonialDrag.armed, testimonialDrag.dragIndex, testimonialDrag.overIndex, i)}`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-light-grey truncate">{t.name}</p>
                        <p className="text-[10px] text-steel-gray truncate">{t.text}</p>
                        <p className="text-[10px] text-steel-gray">{"★".repeat(t.rating)}</p>
                      </div>
                      {(t.photos ?? []).length > 0 && (
                        <div className="mt-2 flex gap-1.5">
                          {t.photos.map((url) => (
                            <div key={url} className="relative h-12 w-12 shrink-0 overflow-hidden rounded border border-steel-gray bg-dark-grey">
                              <Image src={url} alt={`${t.name} photo`} fill className="object-cover" unoptimized draggable={false} />
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="absolute top-1 right-1 z-10 flex items-center gap-1">
                        <button
                          onClick={() => editTestimonial(t)}
                          disabled={isPending}
                          aria-label="Edit testimonial"
                          title="Edit"
                          className="rounded bg-ink-black/80 p-1 text-light-grey transition-colors hover:bg-light-grey hover:text-ink-black disabled:opacity-40"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTestimonial(t.id);
                          }}
                          disabled={isPending}
                          aria-label="Delete testimonial"
                          title="Delete"
                          className="rounded bg-ink-black/80 px-1.5 py-0.5 text-xs font-bold text-signal-red transition-colors hover:bg-signal-red hover:text-white disabled:opacity-40"
                        >
                          X
                        </button>
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
