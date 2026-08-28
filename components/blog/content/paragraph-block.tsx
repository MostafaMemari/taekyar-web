export function ParagraphBlock({ text, lead = false }: { text: string; lead?: boolean }) {
  if (lead) {
    return (
      <p className="text-[15px] font-medium leading-8 text-foreground/80 sm:text-base sm:leading-9 lg:text-lg lg:leading-10">
        {text}
      </p>
    );
  }

  return (
    <p className="text-[14.5px] leading-8 text-muted-foreground sm:text-[15px] sm:leading-8 lg:text-base lg:leading-9">
      {text}
    </p>
  );
}
