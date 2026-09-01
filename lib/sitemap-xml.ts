export interface SitemapXmlUrl {
  loc: string;
  lastmod?: Date | null;
  changeFrequency?: string;
  priority?: number;
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function urlSetXml(entries: SitemapXmlUrl[]): string {
  const body = entries
    .map(({ loc, lastmod, changeFrequency, priority }) => {
      const lastmodTag = lastmod ? `<lastmod>${lastmod.toISOString()}</lastmod>` : "";
      const changefreqTag = changeFrequency ? `<changefreq>${changeFrequency}</changefreq>` : "";
      const priorityTag = typeof priority === "number" ? `<priority>${priority}</priority>` : "";
      return `<url><loc>${escapeXml(loc)}</loc>${lastmodTag}${changefreqTag}${priorityTag}</url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export function sitemapIndexXml(entries: { loc: string; lastmod?: Date | null }[]): string {
  const body = entries
    .map(({ loc, lastmod }) => {
      const lastmodTag = lastmod ? `<lastmod>${lastmod.toISOString()}</lastmod>` : "";
      return `<sitemap><loc>${escapeXml(loc)}</loc>${lastmodTag}</sitemap>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`;
}
