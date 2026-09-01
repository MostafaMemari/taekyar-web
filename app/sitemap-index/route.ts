import { getSitemapIndexEntries } from "@/lib/blog";
import { sitemapHref } from "@/lib/routes";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(): Promise<Response> {
  const entries = await getSitemapIndexEntries();

  const body = entries
    .map(({ id, lastmod }) => {
      const loc = `${SITE_URL}${sitemapHref(id)}`;
      const lastmodTag = lastmod ? `<lastmod>${lastmod.toISOString()}</lastmod>` : "";
      return `<sitemap><loc>${escapeXml(loc)}</loc>${lastmodTag}</sitemap>`;
    })
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`,
    { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=0, must-revalidate" } },
  );
}
