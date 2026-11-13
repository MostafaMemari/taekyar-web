import { BLOG_INDEX_INTRO } from "@/data/blog/index-page";

export function BlogHeader() {
  return (
    <div>
      <h1 className="text-center text-balance font-heading text-[2rem] leading-[1.4] text-[#c79500] sm:text-[2.75rem] sm:leading-[1.3] lg:text-[3.25rem] lg:leading-[1.25]">
        {BLOG_INDEX_INTRO.title}
      </h1>
      <div aria-hidden="true" className="mx-auto mt-5 flex w-56 items-center gap-2">
        <span className="h-px flex-1 bg-gradient-to-l from-[#E0A800] to-transparent" />
        <span className="size-1.5 rotate-45 bg-[#E0A800]" />
        <span className="h-px flex-1 bg-gradient-to-r from-[#E0A800] to-transparent" />
      </div>
      {BLOG_INDEX_INTRO.description ? (
        <p className="mx-auto mt-6 max-w-2xl text-center text-pretty text-[15px] leading-8 text-black/55">
          {BLOG_INDEX_INTRO.description}
        </p>
      ) : null}
    </div>
  );
}
