import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/lib/data";
import { SURFACE_CARD, SURFACE_CARD_INTERACTIVE } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { BLOG_PREVIEW_COUNT, CATEGORY_STYLES } from "./data";

export function BlogPreview() {
  return (
    <Section id="blog-preview">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            eyebrow="وبلاگ تک‌یار"
            title="از وبلاگ تک‌یار بخوانید"
            description="آموزش فن‌ها، تحلیل مسابقات و نکات تغذیه؛ نوشته‌هایی که هر هفته مستقیم از تشک به خواندن می‌ارزند."
            className="max-w-xl"
          />
          <Button
            variant="outline"
            asChild
            className="h-11 gap-2 rounded-xl bg-card font-semibold shadow-sm"
          >
            <Link href="/blog">
              مشاهده همه مقالات
              <ArrowLeft className="!size-4" />
            </Link>
          </Button>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-5 md:grid-cols-3 lg:mt-12">
        {blogPosts.slice(0, BLOG_PREVIEW_COUNT).map((post, index) => {
          const { color, Icon } = CATEGORY_STYLES[post.category];

          return (
            <Reveal key={post.id} delay={index * 90}>
              <article
                className={cn(
                  SURFACE_CARD,
                  SURFACE_CARD_INTERACTIVE,
                  "flex h-full flex-col overflow-hidden"
                )}
              >
                <div className="relative h-32 w-full overflow-hidden sm:h-36">
                  <div className="absolute inset-0" style={{ backgroundColor: color }} />
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.09)_0_2px,transparent_2px_16px)]" />
                  <Icon
                    className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 text-white/30"
                    strokeWidth={1.5}
                  />
                  <Badge className="absolute start-3 top-3 border-none bg-white/90 text-xs font-semibold text-[#171717] shadow-sm">
                    {post.category}
                  </Badge>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-bold leading-7">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="transition-colors hover:text-primary"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-1.5 text-xs font-medium text-muted-foreground">
                    {post.date} · {post.readTimeMinutes} دقیقه مطالعه
                  </p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-primary transition-opacity hover:opacity-80"
                  >
                    ادامه مطلب
                    <ArrowLeft className="size-4" />
                  </Link>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
