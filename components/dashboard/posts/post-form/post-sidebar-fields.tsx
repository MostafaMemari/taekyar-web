import { Check } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { POST_FORM_LABELS } from "@/data/dashboard/ui";
import { cn } from "@/lib/utils";

interface CategoryCheckboxProps {
  label: string;
  depth: number;
  checked: boolean;
  onToggle: () => void;
}

function CategoryCheckbox({ label, depth, checked, onToggle }: CategoryCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      style={{ paddingInlineStart: `calc(0.625rem + ${depth * 1.15}rem)` }}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg border border-transparent py-2 pe-2.5 text-start text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 motion-reduce:transition-none",
        checked
          ? "border-primary/40 bg-card font-bold text-foreground"
          : "text-muted-foreground hover:bg-card/70 hover:text-foreground",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-[5px] border",
          checked ? "border-primary bg-primary text-white" : "border-border bg-card",
        )}
      >
        {checked ? <Check className="size-3" strokeWidth={3} /> : null}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}

interface PostSidebarFieldsProps {
  categories: Array<{ id: number; name: string; depth: number }>;
  selectedCategoryIds: number[];
  onToggleCategory: (id: number) => void;
  tags: Array<{ id: number; name: string }>;
  selectedTagIds: number[];
  onToggleTag: (id: number) => void;
}

export function PostSidebarFields({
  categories,
  selectedCategoryIds,
  onToggleCategory,
  tags,
  selectedTagIds,
  onToggleTag,
}: PostSidebarFieldsProps) {
  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[14px] font-black">{POST_FORM_LABELS.categoryLabel}</CardTitle>
          <p className="text-xs leading-5 text-muted-foreground">{POST_FORM_LABELS.categoryHint}</p>
        </CardHeader>
        <CardContent>
          <div
            role="group"
            aria-label={POST_FORM_LABELS.categoryLabel}
            className="space-y-0.5 rounded-xl border border-border/60 bg-muted/25 p-1.5"
          >
            {categories.map((category) => (
              <CategoryCheckbox
                key={category.id}
                label={category.name}
                depth={category.depth}
                checked={selectedCategoryIds.includes(category.id)}
                onToggle={() => onToggleCategory(category.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[14px] font-black">{POST_FORM_LABELS.tagsLabel}</CardTitle>
          <p className="text-xs leading-5 text-muted-foreground">{POST_FORM_LABELS.tagsHint}</p>
        </CardHeader>
        <CardContent>
          {tags.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 px-4 py-6 text-center">
              <p className="text-[13px] font-medium text-muted-foreground">{POST_FORM_LABELS.tagsEmpty}</p>
            </div>
          ) : (
            <div
              role="group"
              aria-label={POST_FORM_LABELS.tagsLabel}
              className="flex flex-wrap gap-2"
            >
              {tags.map((tag) => {
                const selected = selectedTagIds.includes(tag.id);

                return (
                  <button
                    key={tag.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onToggleTag(tag.id)}
                    className={cn(
                      "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 motion-reduce:transition-none",
                      selected
                        ? "border-primary bg-primary text-white shadow-sm shadow-primary/20"
                        : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground",
                    )}
                  >
                    {selected ? <Check className="size-3.5 shrink-0" aria-hidden="true" /> : null}
                    {tag.name}
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
