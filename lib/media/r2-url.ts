export function r2PublicUrl(key: string): string {
  const base = (process.env.R2_PUBLIC_URL ?? "").trim().replace(/\/$/, "");
  return `${base}/${key}`;
}
