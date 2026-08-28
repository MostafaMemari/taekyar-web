export function r2PublicUrl(key: string): string {
  const base = process.env.R2_PUBLIC_URL ?? "";
  return `${base.replace(/\/$/, "")}/${key}`;
}
