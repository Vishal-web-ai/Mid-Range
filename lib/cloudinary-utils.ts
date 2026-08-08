const CLOUDINARY_PATTERN = /^https:\/\/res\.cloudinary\.com\/.+\/image\/upload\//;

export function isCloudinaryUrl(url: string): boolean {
  return CLOUDINARY_PATTERN.test(url);
}

export function getOptimizedUrl(url: string, width: number): string {
  if (!isCloudinaryUrl(url)) return url;
  const transformation = `f_auto,q_auto,w_${width}`;
  return url.replace("/upload/", `/upload/${transformation}/`);
}

function getSquareUrl(url: string, size: number): string {
  if (!isCloudinaryUrl(url)) return url;
  const transformation = `f_auto,q_auto,w_${size},h_${size},c_fill,g_auto`;
  return url.replace("/upload/", `/upload/${transformation}/`);
}

export function getThumbnailUrl(url: string): string {
  return getSquareUrl(url, 200);
}

export function getMediumUrl(url: string): string {
  return getSquareUrl(url, 800);
}

export function getFullUrl(url: string): string {
  return getOptimizedUrl(url, 1600);
}
