const CLOUDINARY_PATTERN = /^https:\/\/res\.cloudinary\.com\/.+\/image\/upload\//;

export function isCloudinaryUrl(url: string): boolean {
  return CLOUDINARY_PATTERN.test(url);
}

export function getOptimizedUrl(url: string, width: number): string {
  if (!isCloudinaryUrl(url)) return url;
  const transformation = `f_auto,q_auto,w_${width}`;
  return url.replace("/upload/", `/upload/${transformation}/`);
}

export function getThumbnailUrl(url: string): string {
  return getOptimizedUrl(url, 200);
}

export function getMediumUrl(url: string): string {
  return getOptimizedUrl(url, 800);
}

export function getFullUrl(url: string): string {
  return getOptimizedUrl(url, 1600);
}
