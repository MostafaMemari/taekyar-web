import Link from "next/link";
import { ArrowLeft, Newspaper, Salad, Target } from "lucide-react";

import { BeltDivider } from "@/components/belt-divider";
import { Reveal } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { blogPosts, type BlogCategoryName } from "@/lib/mock-data";

const CATEGORY_STYLES: Record<
  BlogCategoryName,
  { color: string; Icon: typeof Target }
> = {
  "تکنیک‌ها": { color: "#1f5fa8", Icon: Target },
  "اخبار و مسابقات": { color: "#c21807", Icon: Newspaper },
  "تغذیه و تناسب اندام": { color: "#2e8b57", Icon: Salad },
};

export function BlogPreview() {
  return (
    <section id="blog-preview" className="theme-light bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8 lg:pb-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-sm font-bold text-primary">وبلاگ تک‌یار</span>
              <h2 className="mt-2 text-3xl font-black leading-snug sm:text-4xl">
                از وبلاگ تک‌یار بخوانید
              </h2>
              <BeltDivider
                fullWidth={false}
                variant="pill"
                className="mt-3 h-1 w-20"
              />
              <p className="mt-3 text-[15px] leading-7 text-muted-foreground sm:text-base sm:leading-8">
                آموزش فن‌ها، تحلیل مسابقات و نکات تغذیه؛ نوشته‌هایی که هر هفته
                مستقیم از تشک به خواندن می‌ارزند.
              </p>
            </div>
            <Button variant="outline" className="gap-2 font-semibold" asChild>
              <Link href="/blog">
                مشاهده همه مقالات
                <ArrowLeft />
              </Link>
            </Button>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-3 lg:mt-10">
          {blogPosts.slice(0, 3).map((post, index) => {
            const { color, Icon } = CATEGORY_STYLES[post.category];
            return (
              <Reveal key={post.id} delay={index * 100}>
                <Card className="h-full gap-0 pt-0 shadow-md shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10">
                  <div className="relative h-32 w-full overflow-hidden sm:h-36">
                    <div className="absolute inset-0" style={{ backgroundColor: color }} />
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.09)_0_2px,transparent_2px_16px)]" />
                    <Icon className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 text-white/30" strokeWidth={1.5} />
                    <Badge className="absolute start-3 top-3 border-none bg-white/90 text-xs font-semibold text-[#171717] shadow-sm">
                      {post.category}
                    </Badge>
                  </div>

                  <CardHeader className="mt-4">
                    <CardTitle className="text-base font-bold leading-7">
                      <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-primary">
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-xs font-medium">
                      {post.date} · {post.readTimeMinutes} دقیقه مطالعه
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="mt-2 text-sm leading-7 text-muted-foreground">
                    {post.excerpt}
                  </CardContent>

                  <CardFooter className="mt-auto justify-end border-t bg-transparent">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-opacity hover:opacity-80"
                    >
                      ادامه مطلب
                      <ArrowLeft className="size-4" />
                    </Link>
                  </CardFooter>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
