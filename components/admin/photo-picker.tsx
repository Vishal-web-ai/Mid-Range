"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface PhotoPickerProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  max?: number;
  className?: string;
}

export function PhotoPicker({ photos, onChange, max = 4, className }: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB.");
      return;
    }

    setError(null);
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
      if (photos.length < max) onChange([...photos, url]);
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
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: max }).map((_, i) => {
          const url = photos[i];
          if (url) {
            return (
              <div
                key={url}
                className="group relative aspect-square overflow-hidden rounded border border-steel-gray bg-ink-black"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Review photo ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => onChange(photos.filter((p) => p !== url))}
                  disabled={uploading}
                  className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-bl bg-signal-red text-[10px] font-bold text-white transition-colors hover:bg-signal-red/80 disabled:opacity-50"
                  aria-label={`Remove photo ${i + 1}`}
                >
                  X
                </button>
              </div>
            );
          }
          return (
            <button
              key={`slot-${i}`}
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex aspect-square items-center justify-center rounded border-2 border-dashed border-steel-gray bg-ink-black text-steel-gray transition-colors hover:border-signal-red/50 disabled:opacity-50"
              aria-label={`Add photo ${i + 1}`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          );
        })}
      </div>
      {uploading && <p className="text-steel-gray text-xs">Uploading...</p>}
      {error && <p className="text-signal-red text-xs">{error}</p>}
    </div>
  );
}
