import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { BlogPost } from "@/lib/data";
import { CATEGORY_STYLES } from "./data";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const { color, Icon } = CATEGORY_STYLES[post.category];

  return (
    <Card className="h-full gap-0 pt-0 shadow-sm shadow-black/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.07]">
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

      <CardHeader className="mt-4">
        <CardTitle className="text-base font-bold leading-7">
          <Link
            href={`/blog/${post.slug}`}
            className="transition-colors hover:text-primary"
          >
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
  );
}
