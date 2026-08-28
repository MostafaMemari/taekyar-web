import type { HeadingLevel } from "@/lib/post-content";

const HEADING_CLASSES: Record<HeadingLevel, string> = {
  1: "text-[1.45rem] font-black leading-[1.5] sm:text-[1.7rem]",
  2: "text-[1.15rem] font-black leading-[1.6] sm:text-[1.35rem] sm:leading-[1.5]",
  3: "text-[1.05rem] font-extrabold leading-[1.6] sm:text-[1.2rem]",
  4: "text-base font-extrabold leading-7 sm:text-[1.05rem] sm:leading-8",
};

export function HeadingBlock({
  id,
  level,
  text,
}: {
  id: string;
  level: HeadingLevel;
  text: string;
}) {
  const Tag = (`h${level}`) as "h1";

  return (
    <Tag
      id={id}
      className={`flex scroll-mt-28 items-center gap-2.5 pt-5 text-foreground sm:gap-3 sm:pt-6 ${HEADING_CLASSES[level]}`}
    >
      {level <= 2 ? (
        <span aria-hidden="true" className="h-5 w-1 shrink-0 rounded-full bg-primary sm:h-6" />
      ) : null}
      {text}
    </Tag>
  );
}
