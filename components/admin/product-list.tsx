"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn, formatPrice } from "@/lib/utils";
import { ProductForm } from "./product-form";
import { ProductEditModal } from "./product-edit-modal";
import ConfirmDialog from "./confirm-dialog";

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountedPrice: number | null;
  size: string | null;
  tag: string | null;
  category: string | null;
  condition: string | null;
  gender: string | null;
  details: string[];
  specifications: { label: string; value: string }[];
  images: string[];
  video: string | null;
  status: string;
  createdAt: Date | string;
}

export function ProductList({ products }: { products: Product[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [tick, setTick] = useState(false);

  async function handleDelete(id: string) {
    setLoading(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Product deleted");
      setDeleteTarget(null);
      router.refresh();
    } catch {
      toast.error("Failed to delete product");
      setDeleteTarget(null);
    } finally {
      setLoading(null);
    }
  }

  function handleSaved() {
    setTick(true);
    setTimeout(() => {
      setTick(false);
      setEditing(null);
      setShowForm(false);
      router.refresh();
    }, 1300);
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="btn-primary text-sm"
        >
          + Add New Product
        </button>
      </div>

      {/* Form panel */}
      {showForm && (
        <div className="border-steel-gray bg-dark-grey mb-6 rounded border p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-signal-red font-hero text-lg font-bold">
              {editing ? "Edit Product" : "Add New Product"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
              className="text-signal-red hover:opacity-70 transition-opacity"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <ProductForm product={editing} onSaved={handleSaved} />
        </div>
      )}

      {/* Desktop table */}
      <div className="border-steel-gray bg-dark-grey hidden overflow-x-auto rounded border lg:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-steel-gray text-steel-gray border-b text-xs uppercase">
              <th className="p-3">Image</th>
              <th className="p-3">Title</th>
              <th className="p-3">Price</th>
              <th className="p-3">Size</th>
              <th className="p-3">Tag</th>
              <th className="p-3">Category</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={8} className="text-steel-gray p-8 text-center">
                  No products yet.
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr
                key={p.id}
                onClick={() => setEditTarget(p)}
                className="border-steel-gray/50 hover:bg-ink-black/50 cursor-pointer border-b transition-colors last:border-0"
              >
                <td className="p-3">
                  {p.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="h-12 w-12 rounded object-cover"
                    />
                  ) : (
                    <div className="bg-ink-black text-steel-gray flex h-12 w-12 items-center justify-center rounded text-xs">
                      N/A
                    </div>
                  )}
                </td>
                <td className="text-light-grey max-w-[200px] truncate p-3 font-medium">
                  {p.title}
                </td>
                <td className="p-3">
                  {p.discountedPrice != null ? (
                    <span className="flex items-center gap-1.5">
                      <span className="text-steel-gray line-through">{formatPrice(p.price)}</span>
                      <span className="text-signal-red font-medium">
                        {formatPrice(p.discountedPrice)}
                      </span>
                    </span>
                  ) : (
                    <span className="text-light-grey">{formatPrice(p.price)}</span>
                  )}
                </td>
                <td className="text-light-grey p-3">{p.size ?? "\u2014"}</td>
                <td className="p-3">
                  {p.tag ? (
                    <span className="bg-signal-red/20 text-signal-red inline-block rounded px-2 py-0.5 text-xs font-medium">
                      {p.tag}
                    </span>
                  ) : (
                    <span className="text-steel-gray">{"\u2014"}</span>
                  )}
                </td>
                <td className="text-light-grey p-3">
                  {p.category ?? "\u2014"}
                  {p.gender && <span className="text-steel-gray"> / {p.gender}</span>}
                </td>
                <td className="p-3">
                  <span
                    className={cn(
                      "inline-block rounded px-2 py-0.5 text-xs font-medium",
                      p.status === "available"
                        ? "bg-green-900/40 text-green-400"
                        : "bg-signal-red/20 text-signal-red",
                    )}
                  >
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(p);
                      }}
                      disabled={loading === p.id}
                      className="bg-signal-red/20 hover:bg-signal-red/30 text-signal-red rounded px-2.5 py-1 font-semibold text-xs sm:text-sm transition-colors disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 lg:hidden">
        {products.length === 0 && (
          <p className="border-steel-gray bg-dark-grey text-steel-gray rounded border p-8 text-center">
            No products yet.
          </p>
        )}
        {products.map((p) => (
          <div
            key={p.id}
            onClick={() => setEditTarget(p)}
            className="border-steel-gray bg-dark-grey hover:border-signal-red/50 relative flex cursor-pointer gap-3 rounded border p-3 transition-colors"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteTarget(p);
              }}
              disabled={loading === p.id}
              aria-label="Delete product"
              className="text-signal-red hover:bg-signal-red/10 absolute top-1.5 right-1.5 z-10 flex h-7 w-7 items-center justify-center rounded transition-colors disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {p.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.images[0]}
                alt={p.title}
                className="h-16 w-16 shrink-0 rounded object-cover"
              />
            ) : (
              <div className="bg-ink-black text-steel-gray flex h-16 w-16 shrink-0 items-center justify-center rounded text-xs">
                N/A
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 pr-8">
                <p className="text-light-grey min-w-0 truncate font-medium">{p.title}</p>
                {p.tag && (
                  <span className="bg-signal-red/20 text-signal-red max-w-[30%] shrink-0 truncate rounded px-1.5 py-0.5 text-[10px] font-medium">
                    {p.tag}
                  </span>
                )}
              </div>
              {p.discountedPrice != null ? (
                <p className="text-sm">
                  <span className="text-steel-gray line-through">{formatPrice(p.price)}</span>{" "}
                  <span className="text-signal-red font-medium">
                    {formatPrice(p.discountedPrice)}
                  </span>
                </p>
              ) : (
                <p className="text-light-grey text-sm">{formatPrice(p.price)}</p>
              )}
              <div className="text-steel-gray mt-1 flex flex-wrap items-center gap-2 text-xs">
                {p.size && <span>{p.size}</span>}
                {p.category && <span>{p.category}</span>}
                {p.gender && <span>{p.gender}</span>}
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5",
                    p.status === "available"
                      ? "bg-green-900/40 text-green-400"
                      : "bg-steel-gray/30 text-steel-gray",
                  )}
                >
                  {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editTarget && (
        <ProductEditModal
          product={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={() => {
            setEditTarget(null);
            router.refresh();
          }}
        />
      )}

      {/* Delete confirmation modal */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget.id)}
        title="Delete Product"
        confirmLabel="Delete"
        loading={loading === deleteTarget?.id}
        loadingLabel="Deleting..."
        danger
      >
        {deleteTarget && (
          <div className="flex items-center gap-3">
            {deleteTarget.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={deleteTarget.images[0]}
                alt={deleteTarget.title}
                className="h-14 w-14 shrink-0 rounded object-cover"
              />
            ) : (
              <div className="bg-ink-black text-steel-gray flex h-14 w-14 shrink-0 items-center justify-center rounded text-xs">
                N/A
              </div>
            )}
            <div className="min-w-0">
              <p className="text-light-grey truncate font-medium">{deleteTarget.title}</p>
              <p className="text-steel-gray text-sm">
                {formatPrice(deleteTarget.price)}
                {deleteTarget.discountedPrice != null &&
                  ` \u2192 ${formatPrice(deleteTarget.discountedPrice)}`}
              </p>
            </div>
          </div>
        )}
        <p className="text-signal-red mt-4 text-sm leading-relaxed">
          This will permanently delete the product. This action cannot be undone.
        </p>
      </ConfirmDialog>

      {/* Saved tick overlay */}
      {tick && (
        <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-4 bg-black/80">
          <div className="animate-check-pop bg-green-500 flex h-24 w-24 items-center justify-center rounded-full shadow-lg shadow-green-500/40">
            <svg
              className="check-draw h-12 w-12 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <p className="text-light-grey text-sm font-medium tracking-wide uppercase">Saved</p>
        </div>
      )}
    </div>
  );
}
