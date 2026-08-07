"use client";

const CLOUDINARY_UPLOAD = /\/image\/upload\/(?:[a-z0-9_]+,)+[a-z0-9_]+\//;

function cloudinarySrc(src: string, transform: string): string {
  const replaced = src.replace(CLOUDINARY_UPLOAD, `/image/upload/${transform}/`);
  if (replaced !== src) return replaced;
  return src.replace("/upload/", `/upload/${transform}/`);
}

export default function imagesLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (/^https:\/\/res\.cloudinary\.com\/.+\/image\/upload\//.test(src)) {
    const transform = ["f_auto", "c_limit", `w_${width}`, `q_${quality ?? 75}`].join(",");
    return cloudinarySrc(src, transform);
  }
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}w=${width}`;
}
