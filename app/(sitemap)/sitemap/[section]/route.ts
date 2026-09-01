import {
  SITEMAP_PAGES,
  SITEMAP_URLS_PER_FILE,
  buildSitemapSectionIds,
  getBlogSitemapEntries,
  getCategorySitemapEntries,
  getPageSitemapEntries,
  getSitemapSectionCounts,
  getTagSitemapEntries,
} from "@/lib/blog";
import { categoryHref, pageHref, postHref, tagHref } from "@/lib/routes";
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
    const staticCount = SITEMAP_PAGES.length;
    const dbSkip = Math.max(0, (chunk - 1) * SITEMAP_URLS_PER_FILE - staticCount);
    const dbTake = chunk === 1 ? SITEMAP_URLS_PER_FILE - staticCount : SITEMAP_URLS_PER_FILE;
    const [staticEntries, dbEntries] = await Promise.all([
      chunk === 1
        ? Promise.resolve(
            SITEMAP_PAGES.map(({ path, changeFrequency, priority }) => ({
              loc: `${SITE_URL}${path}`,
              changeFrequency,
              priority,
            })),
          )
        : Promise.resolve([] as SitemapXmlUrl[]),
      getPageSitemapEntries({ skip: dbSkip, take: dbTake }),
    ]);
    entries = [
      ...staticEntries,
      ...dbEntries.map((page) => ({
        loc: `${SITE_URL}${pageHref(page.slug)}`,
        lastmod: page.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
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
