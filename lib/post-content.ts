import { r2PublicUrl } from "@/lib/r2-url";

export interface TocItem {
  id: string;
  text: string;
}

export function headingId(index: number): string {
  return `heading-${index}`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replaceAll("'", "&#39;");
}

interface LegacyBlock {
  type: string;
  level?: number;
  ordered?: boolean;
  text?: string;
  items?: unknown;
  src?: string;
  alt?: string;
  caption?: string | null;
}

function legacyBlockToHtml(block: LegacyBlock): string {
  const text = String(block.text ?? "").trim();

  switch (block.type) {
    case "paragraph":
      return text ? `<p>${escapeHtml(text)}</p>` : "";
    case "heading": {
      const level =
        typeof block.level === "number"
          ? Math.min(Math.max(Math.round(block.level), 1), 4)
          : 2;
      return text ? `<h${level}>${escapeHtml(text)}</h${level}>` : "";
    }
    case "list": {
      const items = (Array.isArray(block.items) ? block.items : [])
        .map((item) => String(item).trim())
        .filter(Boolean);
      if (items.length === 0) return "";
      const tag = block.ordered ? "ol" : "ul";
      return `<${tag}>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</${tag}>`;
    }
    case "quote":
      return text ? `<blockquote><p>${escapeHtml(text)}</p></blockquote>` : "";
    case "tip":
      return text
        ? `<aside class="coach-tip"><span class="coach-tip-label">نکته مربی</span><p>${escapeHtml(text)}</p></aside>`
        : "";
    case "warning":
      return text
        ? `<aside class="important-note"><span class="important-note-label">نکته مهم</span><p>${escapeHtml(text)}</p></aside>`
        : "";
    case "divider":
      return "<hr>";
    case "image": {
      const src = String(block.src ?? "").trim();
      if (!src) return "";
      const alt = escapeAttr(String(block.alt ?? ""));
      const caption = String(block.caption ?? "").trim();
      return `<figure><img src="${escapeAttr(r2PublicUrl(src))}" alt="${alt}" loading="lazy" decoding="async" />${
        caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""
      }</figure>`;
    }
    default:
      return "";
  }
}

export function legacyBlocksToHtml(blocks: LegacyBlock[]): string {
  return blocks.map(legacyBlockToHtml).filter(Boolean).join("\n");
}

export function parsePostHtml(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return legacyBlocksToHtml(value as LegacyBlock[]);
  return "";
}

export function injectHeadingIds(html: string): string {
  let index = 0;
  return html.replace(/<h([1-4])(\s[^>]*)?>/g, (match) => {
    const id = headingId(index++);
    return match.replace(/>$/, ` id="${id}">`);
  });
}

export function getHeadings(html: string): TocItem[] {
  const items: TocItem[] = [];
  const pattern = /<h([1-4])[^>]*>(.*?)<\/h\1>/g;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = pattern.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]*>/g, "").trim();
    if (text) items.push({ id: headingId(index++), text });
  }

  return items;
}

export function sanitizePostHtml(html: string): string {
  return html
    .replaceAll(/<script[\s\S]*?<\/script>/gi, "")
    .replaceAll(/<script[^>]*\/?>/gi, "")
    .replaceAll(/\son\w+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "")
    .replaceAll(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1="#"');
}
