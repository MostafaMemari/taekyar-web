export function QuoteBlock({ text }: { text: string }) {
  return (
    <blockquote className="relative overflow-hidden rounded-2xl border-s-[3px] border-primary bg-background p-4 ps-10 sm:p-6 sm:ps-14">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute start-3.5 top-3.5 select-none text-lg font-black leading-none text-primary/15 sm:start-4 sm:top-4 sm:text-xl"
      >
        «»
      </span>
      <p className="text-[14.5px] font-semibold leading-7 text-foreground/90 sm:text-[15px] sm:leading-8 lg:text-base lg:leading-9">
        {text}
      </p>
    </blockquote>
  );
}
