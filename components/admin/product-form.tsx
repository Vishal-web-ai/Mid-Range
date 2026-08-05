"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ImageUpload } from "./image-upload";
import { CustomSelect } from "./custom-select";

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountedPrice: number | null;
  size: string | null;
  category: string | null;
  condition: string | null;
  gender: string | null;
  details: string[];
  specifications: { label: string; value: string }[];
  images: string[];
  status: string;
  createdAt: Date | string;
}

const CATEGORIES = ["Jackets", "Tops", "Bottoms", "Dresses", "Accessories"] as const;
const RATINGS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const SPEC_EXAMPLES = [
  { label: "Fit", value: "Oversized Fit" },
  { label: "Fabric", value: "100% Premium Cotton" },
  { label: "Design", value: "Solid" },
  { label: "Sleeve", value: "Half Sleeve" },
  { label: "Neck", value: "Round Neck" },
  { label: "Occasion", value: "Casual Wear" },
] as const;

interface ProductFormProps {
  product: Product | null;
  onSaved: () => void;
}

export function ProductForm({ product, onSaved }: ProductFormProps) {
  const isEdit = !!product;

  const [title, setTitle] = useState(product?.title ?? "");
  const [priceRupees, setPriceRupees] = useState(product ? String(product.price / 100) : "");
  const [discountedPriceRupees, setDiscountedPriceRupees] = useState(
    product?.discountedPrice ? String(product.discountedPrice / 100) : "",
  );
  const [size, setSize] = useState(product?.size ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [customCategory, setCustomCategory] = useState(
    product?.category && !CATEGORIES.includes(product.category as typeof CATEGORIES[number]) ? product.category : "",
  );
  const [condition, setCondition] = useState(product?.condition ?? "");
  const [gender, setGender] = useState(product?.gender ?? "");
  const [specifications, setSpecifications] = useState<{ label: string; value: string }[]>(
    product?.specifications?.length
      ? product.specifications.map((s) => ({ label: s.label, value: s.value }))
      : [{ label: "", value: "" }, { label: "", value: "" }, { label: "", value: "" }],
  );
  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.images?.length ? [...product.images] : [""],
  );

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function addImageField() {
    setImageUrls((prev) => [...prev, ""]);
  }

  function removeImageField(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function updateImageUrl(index: number, value: string) {
    setImageUrls((prev) => prev.map((url, i) => (i === index ? value : url)));
  }

  function addSpecification() {
    setSpecifications((prev) => [...prev, { label: "", value: "" }]);
  }

  function updateSpecification(index: number, field: "label" | "value", value: string) {
    setSpecifications((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  function removeSpecification(index: number) {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  }

  const effectiveCategory = category === "__custom" ? customCategory.trim() : category;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    const trimmedUrls = imageUrls.map((u) => u.trim()).filter((u) => u.length > 0);

    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    const parsedPrice = parseFloat(priceRupees);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError("Price must be a positive number.");
      return;
    }

    if (trimmedUrls.length === 0) {
      setError("At least one image URL is required.");
      return;
    }

    const pricePaise = Math.round(parsedPrice * 100);
    const discountedPaise = discountedPriceRupees
      ? Math.round(parseFloat(discountedPriceRupees) * 100)
      : undefined;

    const body: Record<string, unknown> = {
      title: trimmedTitle,
      price: pricePaise,
      images: trimmedUrls,
      specifications: specifications.length > 0 ? specifications : undefined,
    };

    if (discountedPaise) body.discountedPrice = discountedPaise;
    if (size.trim()) body.size = size.trim();
    if (effectiveCategory) body.category = effectiveCategory;
    if (condition) body.condition = condition;
    if (gender) body.gender = gender;

    setSubmitting(true);
    try {
      const url = isEdit ? `/api/products/${product.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Request failed");
      }

      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded border border-steel-gray bg-ink-black px-3 py-2 text-sm text-light-grey placeholder-steel-gray focus:border-signal-red focus:outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="border-signal-red/50 bg-signal-red/10 text-signal-red rounded border px-3 py-2 text-sm">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="text-light-grey mb-1 block text-xs font-medium">
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
          placeholder="Vintage Denim Jacket"
        />
      </div>

      {/* Price & Discounted Price */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="text-light-grey mb-1 block text-xs font-medium">
            Actual Price (₹) *
          </label>
          <input
            id="price"
            type="number"
            step="1"
            min="1"
            value={priceRupees}
            onChange={(e) => setPriceRupees(e.target.value)}
            className={inputClass}
            placeholder="999"
          />
        </div>
        <div>
          <label htmlFor="discountedPrice" className="text-light-grey mb-1 block text-xs font-medium">
            Discounted Price (₹)
          </label>
          <input
            id="discountedPrice"
            type="number"
            step="1"
            min="0"
            value={discountedPriceRupees}
            onChange={(e) => setDiscountedPriceRupees(e.target.value)}
            className={inputClass}
            placeholder="499"
          />
          {priceRupees && discountedPriceRupees && parseFloat(discountedPriceRupees) < parseFloat(priceRupees) && (
            <p className="text-signal-red mt-1 text-xs font-medium">
              <span className="line-through text-steel-gray mr-1">₹{priceRupees}</span>
              ₹{discountedPriceRupees} ({Math.round(((parseFloat(priceRupees) - parseFloat(discountedPriceRupees)) / parseFloat(priceRupees)) * 100)}% off)
            </p>
          )}
        </div>
      </div>

      {/* Size, Gender, Condition */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="size" className="text-light-grey mb-1 block text-xs font-medium">
            Size
          </label>
          <input
            id="size"
            type="number"
            min="0"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className={inputClass}
            placeholder="e.g. 42"
          />
        </div>

        <div>
          <label className="text-light-grey mb-1 block text-xs font-medium">
            Gender
          </label>
          <CustomSelect
            value={gender}
            onChange={setGender}
            placeholder="Select gender"
            options={[
              { label: "Men", value: "men" },
              { label: "Women", value: "women" },
              { label: "Unisex", value: "unisex" },
            ]}
          />
        </div>

        <div>
          <label className="text-light-grey mb-1 block text-xs font-medium">
            Condition
          </label>
          <CustomSelect
            value={condition}
            onChange={setCondition}
            placeholder="Select rating"
            options={RATINGS.map((r) => ({ label: `${r}/10`, value: `${r}/10` }))}
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="text-light-grey mb-1 block text-xs font-medium">
          Category
        </label>
        <CustomSelect
          value={category}
          onChange={setCategory}
          placeholder="Select category"
          options={[
            ...CATEGORIES.map((c) => ({ label: c, value: c })),
            { label: "Write your own...", value: "__custom" },
          ]}
        />
        {category === "__custom" && (
          <input
            type="text"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className={cn(inputClass, "mt-2")}
            placeholder="Enter custom category"
          />
        )}
      </div>

      {/* Description */}
      <div>
        <label className="text-light-grey mb-1 block text-xs font-medium">
          Description
        </label>
        {specifications.length > 0 && (
          <div className="mb-2 flex flex-col gap-2">
            {specifications.map((spec, i) => {
              const example = SPEC_EXAMPLES[i % SPEC_EXAMPLES.length];
              return (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={spec.label}
                    onChange={(e) => updateSpecification(i, "label", e.target.value)}
                    className={cn(inputClass, "flex-1")}
                    placeholder={`e.g. ${example.label}`}
                  />
                  <span className="text-steel-gray">:</span>
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => updateSpecification(i, "value", e.target.value)}
                    className={cn(inputClass, "flex-[2]")}
                    placeholder={`e.g. ${example.value}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecification(i)}
                    className="text-signal-red shrink-0 text-xs transition-opacity hover:opacity-70"
                    aria-label="Remove specification"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <button
          type="button"
          onClick={addSpecification}
          className="text-signal-red mt-2 text-xs font-medium transition-opacity hover:opacity-70"
        >
          + Add More Descriptions
        </button>
      </div>

      {/* Images */}
      <div>
        <label className="text-light-grey mb-1 block text-xs font-medium">Images *</label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {imageUrls.map((url, i) => (
            <div key={i} className="relative">
              <ImageUpload value={url} onChange={(newUrl) => updateImageUrl(i, newUrl)} />
              {imageUrls.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(i)}
                  className="text-signal-red hover:opacity-70 absolute -top-2 -right-2 z-10 rounded-full bg-dark-grey p-1 transition-opacity"
                  aria-label="Remove image"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addImageField}
          className="text-signal-red hover:opacity-70 mt-2 text-xs transition-opacity"
        >
          + Add another image
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary text-sm disabled:opacity-50"
        >
          {submitting
            ? isEdit
              ? "Saving..."
              : "Creating..."
            : isEdit
              ? "Save Changes"
              : "Create Product"}
        </button>
      </div>
    </form>
  );
}
