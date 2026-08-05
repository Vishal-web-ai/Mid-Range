"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tip, setTip] = useState<string | null>(null);
  const [tipGood, setTipGood] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setTip(null);
      setTipGood(false);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB.");
      return;
    }

    setError(null);
    setTip(null);
    setTipGood(false);

    const dims = await new Promise<{ w: number; h: number }>((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = () => resolve({ w: 0, h: 0 });
      img.src = URL.createObjectURL(file);
    });

    if (dims.w && dims.h) {
      const ratio = dims.w / dims.h;
      if (ratio >= 0.9 && ratio <= 1.1) {
        setTip("Square 1:1 — displays perfectly, no bars or cropping.");
        setTipGood(true);
      } else {
        const ratioText = ratio >= 1 ? `1:${(ratio).toFixed(2).replace(/0$/, "")}` : `${(1 / ratio).toFixed(2).replace(/0$/, "")}:1`;
        setTip(`This image is ${dims.w}\u00d7${dims.h} (${ratioText}). Tip: use a 1:1 square image to avoid bars or cropping.`);
        setTipGood(false);
      }
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Upload failed");
      }

      const { url } = await res.json();
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="group relative">
          <div className="relative h-40 w-full overflow-hidden rounded border border-steel-gray bg-ink-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Uploaded image"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded bg-ink-black/80 px-2 py-1 text-xs text-light-grey backdrop-blur-sm transition-colors hover:bg-ink-black"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={uploading}
              className="rounded bg-signal-red/80 px-2 py-1 text-xs text-white backdrop-blur-sm transition-colors hover:bg-signal-red"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded border-2 border-dashed border-steel-gray bg-ink-black transition-colors hover:border-signal-red/50 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-steel-gray border-t-signal-red" />
              <span className="text-steel-gray text-xs">Uploading...</span>
            </>
          ) : (
            <>
              <svg
                className="h-8 w-8 text-steel-gray"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-steel-gray text-xs">Click to upload image</span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-signal-red text-xs">{error}</p>}
      {tip && !error && (
        <p className={cn("text-xs", tipGood ? "text-green-400" : "text-signal-red")}>{tip}</p>
      )}
    </div>
  );
}
