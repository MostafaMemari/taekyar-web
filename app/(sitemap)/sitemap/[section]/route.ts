import {
  SITEMAP_PAGES,
  buildSitemapSectionIds,
  getBlogSitemapEntries,
  getCategorySitemapEntries,
  getSitemapSectionCounts,
  getTagSitemapEntries,
} from "@/lib/blog";
import { categoryHref, postHref, tagHref } from "@/lib/routes";
import { SITE_URL } from "@/lib/site";
import { urlSetXml, type SitemapXmlUrl } from "@/lib/sitemap-xml";

export const revalidate = 3600;

const SECTION_PATTERN = /^(pages|blog|categories|tags)(?:-(\d+))?$/;

export async function generateStaticParams() {
  const counts = await getSitemapSectionCounts();
  return buildSitemapSectionIds(counts).map((id) => ({ section: `${id}.xml` }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ section: string }> },
): Promise<Response> {
  const { section: rawSection } = await params;
  const parsed = SECTION_PATTERN.exec(rawSection.replace(/\.xml$/, ""));
  if (!parsed) return new Response("Not Found", { status: 404 });

  const [, name, chunkParam] = parsed;
  const chunk = chunkParam ? Number(chunkParam) : 1;
  if (!Number.isInteger(chunk) || chunk < 1) return new Response("Not Found", { status: 404 });

  let entries: SitemapXmlUrl[];
  if (name === "pages") {
    entries = SITEMAP_PAGES.map(({ path, changeFrequency, priority }) => ({
      loc: `${SITE_URL}${path}`,
      changeFrequency,
      priority,
    }));
  } else if (name === "blog") {
    entries = (await getBlogSitemapEntries(chunk)).map((post) => ({
      loc: `${SITE_URL}${postHref(post.slug)}`,
      lastmod: post.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } else if (name === "categories") {
    entries = (await getCategorySitemapEntries(chunk)).map((category) => ({
      loc: `${SITE_URL}${categoryHref(category.path)}`,
      lastmod: category.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } else {
    entries = (await getTagSitemapEntries(chunk)).map((tag) => ({
      loc: `${SITE_URL}${tagHref(tag.slug)}`,
      lastmod: tag.updatedAt,
      changeFrequency: "weekly",
      priority: 0.4,
    }));
  }

  return new Response(urlSetXml(entries), { headers: { "Content-Type": "text/xml; charset=utf-8" } });
}
