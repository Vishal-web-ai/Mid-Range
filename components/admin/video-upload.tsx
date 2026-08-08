"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface VideoUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export function VideoUpload({ value, onChange, className }: VideoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Please select a video file.");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError("Video must be under 100MB.");
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
        accept="video/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="group relative">
          <div className="bg-ink-black relative h-56 w-full overflow-hidden rounded border border-steel-gray">
            <video
              src={value}
              controls
              playsInline
              preload="metadata"
              className="h-full w-full object-contain"
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
                  d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"
                />
              </svg>
              <span className="text-steel-gray text-xs">Click to upload video</span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-signal-red text-xs">{error}</p>}
    </div>
  );
}
