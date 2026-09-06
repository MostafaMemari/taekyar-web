import { TRAINING_GUIDE_SLUGS } from "@/data/blog/post-config";
import { getBlogPosts, getCategoryTree } from "@/lib/blog";
import { categoryHref, postHref } from "@/lib/routes";
import { SITE_URL } from "@/lib/site";
import { getSiteSettings } from "@/lib/site-settings";

const RECENT_POSTS_COUNT = 10;

function inlineText(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function linkEntry(name: string, href: string, description?: string | null): string {
  const text = inlineText(description);
  return text ? `- [${name}](${href}): ${text}` : `- [${name}](${href})`;
}

function absolute(path: string): string {
  return `${SITE_URL}${path}`;
}

export async function buildLlmsTxt(): Promise<string> {
  const [settings, categories, posts] = await Promise.all([
    getSiteSettings(),
    getCategoryTree(),
    getBlogPosts(),
  ]);

  const appUrl = settings.appDownloadUrl ?? absolute("/#download");
  const lines: string[] = [];

  lines.push("# تک‌یار (TaekYar)");
  lines.push("");
  lines.push(
    "> Smart Taekwondo training assistant for students and coaches — personal training plans, step-by-step technique learning, and belt-progress tracking from white to black belt.",
  );
  lines.push("");
  lines.push(
    "تک‌یار اپلیکیشن همراه تمرین تکواندوست؛ برنامه تمرین شخصی، آموزش گام‌به‌گام فن‌ها و پیگیری ارتقای کمربند. This is the web presence of TaekYar: a Persian-language (fa, RTL) product site and blog. Educational content covers Taekwondo techniques, poomsae, training tips, and nutrition and fitness.",
  );
  lines.push("");

  lines.push("## Main pages");
  lines.push("");
  lines.push(linkEntry("Homepage", absolute("/"), "محصول، امکانات و داستان تک‌یار."));
  lines.push(linkEntry("App download", appUrl, "دریافت اپلیکیشن موبایل تک‌یار."));
  lines.push(linkEntry("Features", absolute("/#features"), "امکانات کلیدی اپلیکیشن تمرینی."));
  lines.push(linkEntry("About", absolute("/about"), "درباره تیم تک‌یار."));
  lines.push(linkEntry("Contact", absolute("/contact"), "ارتباط با تیم پشتیبانی تک‌یار."));
  lines.push("");

  lines.push("## Blog");
  lines.push("");
  lines.push(
    linkEntry(
      "وبلاگ تک‌یار",
      absolute("/blog"),
      "مقالات و آموزش‌های تکواندو؛ تحلیل فن‌ها، پومسه، اخبار مسابقات و نکته‌های تغذیه و تناسب.",
    ),
  );
  lines.push("");

  const guides = posts.filter((post) => TRAINING_GUIDE_SLUGS.includes(post.slug as (typeof TRAINING_GUIDE_SLUGS)[number]));
  if (guides.length > 0) {
    lines.push("## Training guides");
    lines.push("");
    for (const guide of guides) {
      lines.push(linkEntry(guide.title, absolute(postHref(guide.slug)), guide.excerpt));
    }
    lines.push("");
  }

  if (categories.length > 0) {
    lines.push("## Categories");
    lines.push("");
    for (const category of categories) {
      lines.push(linkEntry(category.name, absolute(categoryHref(category.path)), `${category.postCount} articles`));
      for (const child of category.children) {
        lines.push(`  ${linkEntry(child.name, absolute(categoryHref(child.path)), `${child.postCount} articles`)}`);
      }
    }
    lines.push("");
  }

  const recentPosts = posts.slice(0, RECENT_POSTS_COUNT);
  if (recentPosts.length > 0) {
    lines.push("## Recent articles");
    lines.push("");
    for (const post of recentPosts) {
      lines.push(linkEntry(post.title, absolute(postHref(post.slug)), post.excerpt));
    }
    lines.push("");
  }

  lines.push("## Machine-readable index");
  lines.push("");
  lines.push(linkEntry("Sitemap index", absolute("/sitemap.xml"), "Full list of public URLs including all posts, categories, and tags."));

  return `${lines.join("\n")}\n`;
}
