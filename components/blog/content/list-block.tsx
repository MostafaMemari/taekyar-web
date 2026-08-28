export function ListBlock({ ordered, items }: { ordered: boolean; items: string[] }) {
  if (ordered) {
    return (
      <ol className="list-decimal space-y-2.5 ps-6 marker:font-bold marker:text-primary sm:space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="ps-1 text-[14.5px] leading-8 text-muted-foreground sm:text-[15px] sm:leading-8 lg:text-base lg:leading-9"
          >
            {item}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ul className="space-y-2.5 sm:space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span
            aria-hidden="true"
            className="mt-[12px] size-1.5 shrink-0 rounded-full bg-belt-green sm:mt-[13px]"
          />
          <span className="text-[14.5px] leading-8 text-muted-foreground sm:text-[15px] sm:leading-8 lg:text-base lg:leading-9">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
