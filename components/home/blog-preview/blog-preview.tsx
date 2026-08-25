import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/lib/data";
import { BlogCard } from "./blog-card";

const PREVIEW_COUNT = 3;

export function BlogPreview() {
  return (
    <section id="blog-preview" className="theme-light bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader
              eyebrow="وبلاگ تک‌یار"
              title="از وبلاگ تک‌یار بخوانید"
              description="آموزش فن‌ها، تحلیل مسابقات و نکات تغذیه؛ نوشته‌هایی که هر هفته مستقیم از تشک به خواندن می‌ارزند."
              className="max-w-xl"
            />
            <Button variant="outline" className="gap-2 font-semibold" asChild>
              <Link href="/blog">
                مشاهده همه مقالات
                <ArrowLeft />
              </Link>
            </Button>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-3 lg:mt-10">
          {blogPosts.slice(0, PREVIEW_COUNT).map((post, index) => (
            <Reveal key={post.id} delay={index * 100}>
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
