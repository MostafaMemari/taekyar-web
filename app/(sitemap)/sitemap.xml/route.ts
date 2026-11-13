import { getSitemapIndexEntries } from "@/lib/blog";
import { sitemapHref } from "@/lib/routes";
import { SITE_URL } from "@/lib/site/site";
import { sitemapIndexXml } from "@/lib/seo/sitemap-xml";

export const revalidate = 3600;

export async function GET(): Promise<Response> {
  const entries = await getSitemapIndexEntries();
  const xml = sitemapIndexXml(
    entries.map(({ id, lastmod }) => ({ loc: `${SITE_URL}${sitemapHref(id)}`, lastmod })),
  );

  return new Response(xml, { headers: { "Content-Type": "text/xml; charset=utf-8" } });
}
