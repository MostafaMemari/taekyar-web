const R2_S3_API_HOST = ".r2.cloudflarestorage.com";
const MEDIA_ROUTE = "/api/media";

function isPublicMediaHost(base: string): boolean {
  return base.length > 0 && !base.includes(R2_S3_API_HOST);
}

export function r2PublicUrl(key: string): string {
  const base = (process.env.R2_PUBLIC_URL ?? "").trim().replace(/\/$/, "");
  if (!isPublicMediaHost(base)) return `${MEDIA_ROUTE}/${key}`;
  return `${base}/${key}`;
}
