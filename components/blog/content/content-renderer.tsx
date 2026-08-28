import { CoachTipBlock } from "./coach-tip-block";
import { DividerBlock } from "./divider-block";
import { HeadingBlock } from "./heading-block";
import { ImageBlock } from "./image-block";
import { ListBlock } from "./list-block";
import { ParagraphBlock } from "./paragraph-block";
import { QuoteBlock } from "./quote-block";
import { WarningBlock } from "./warning-block";
import { headingId, type PostBlock } from "@/lib/post-content";

function ContentBlock({ block, index }: { block: PostBlock; index: number }) {
  switch (block.type) {
    case "heading":
      return <HeadingBlock id={headingId(index)} level={block.level} text={block.text} />;
    case "list":
      return <ListBlock ordered={block.ordered} items={block.items} />;
    case "quote":
      return <QuoteBlock text={block.text} />;
    case "tip":
      return <CoachTipBlock text={block.text} />;
    case "warning":
      return <WarningBlock text={block.text} />;
    case "divider":
      return <DividerBlock />;
    case "image":
      return <ImageBlock src={block.src} alt={block.alt} caption={block.caption} />;
    default:
      return <ParagraphBlock text={block.text} lead={index === 0} />;
  }
}

export function BlogContentRenderer({ blocks }: { blocks: PostBlock[] }) {
  return (
    <div className="space-y-5 sm:space-y-6">
      {blocks.map((block, index) => (
        <ContentBlock key={index} block={block} index={index} />
      ))}
    </div>
  );
}
