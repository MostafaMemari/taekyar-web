import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { BlogCard } from "@/components/blog/blog-card";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/lib/blog";
import { BLOG_PREVIEW_COUNT, BLOG_PREVIEW_INTRO } from "@/data/home/blog-preview";

export function BlogPreview() {
  return (
    <Section id="blog-preview" divider>
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader {...BLOG_PREVIEW_INTRO} className="max-w-xl" />
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

      <div className="mt-8 grid gap-4 md:grid-cols-3 lg:mt-10 lg:gap-5">
        {blogPosts.slice(0, BLOG_PREVIEW_COUNT).map((post, index) => (
          <Reveal key={post.id} delay={index * 90}>
            <BlogCard post={post} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
