import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CATEGORY_STYLES } from "@/components/blog/data";
import { POST_LABELS, TRAINING_GUIDE_SLUGS } from "@/components/blog/post-config";
import { SidebarSection } from "@/components/blog/sidebar-section";
import { blogPosts } from "@/lib/blog";
import { Dumbbell } from "lucide-react";

interface SidebarGuidesProps {
  currentSlug: string;
}

export function SidebarGuides({ currentSlug }: SidebarGuidesProps) {
  const guides = blogPosts.filter(
    (post) => TRAINING_GUIDE_SLUGS.includes(post.slug as (typeof TRAINING_GUIDE_SLUGS)[number]) && post.slug !== currentSlug,
  );

  if (guides.length === 0) return null;

  return (
    <SidebarSection title={POST_LABELS.guidesTitle} icon={Dumbbell}>
      <ul className="space-y-1">
        {guides.map((post) => {
          const { color, Icon } = CATEGORY_STYLES[post.category];

          return (
            <li key={post.id}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-black/[0.03] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${color}14`, color }}
                >
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-bold leading-6 text-foreground transition-colors group-hover:text-primary">
                    {post.title}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-medium text-muted-foreground">
                    {post.readTimeMinutes} {POST_LABELS.readTimeSuffix}
                  </span>
                </span>
                <ArrowLeft
                  aria-hidden="true"
                  className="mt-1.5 size-3.5 shrink-0 text-muted-foreground/40 transition-all group-hover:-translate-x-0.5 group-hover:text-primary motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </SidebarSection>
  );
}
