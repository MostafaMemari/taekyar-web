import { Check } from "lucide-react";

import { FieldError } from "@/components/shared/form-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { POST_FORM_LABELS } from "@/data/dashboard/ui";
import type { PostFieldErrors } from "@/lib/admin-types";
import { cn } from "@/lib/utils";
import type { FieldDraft } from "./types";

const NO_CATEGORY_VALUE = "none";

interface CategoryRadioProps {
  label: string;
  depth: number;
  checked: boolean;
  onSelect: () => void;
}

function CategoryRadio({ label, depth, checked, onSelect }: CategoryRadioProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      style={{ paddingInlineStart: `${depth * 1.15}rem` }}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg py-2 pe-2.5 text-start text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 motion-reduce:transition-none",
        checked
          ? "bg-card font-bold text-foreground shadow-sm ring-1 ring-primary/40"
          : "text-muted-foreground hover:bg-card/70 hover:text-foreground",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-full border",
          checked ? "border-primary bg-primary text-white" : "border-border bg-card",
        )}
      >
        {checked ? <Check className="size-3" /> : null}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}

interface PostSidebarFieldsProps {
  fields: FieldDraft;
  onFieldChange: <K extends keyof FieldDraft>(key: K, value: FieldDraft[K]) => void;
  categories: Array<{ id: number; name: string; depth: number }>;
  tags: Array<{ id: number; name: string }>;
  selectedTagIds: number[];
  onToggleTag: (id: number) => void;
  fieldErrors: PostFieldErrors;
}

export function PostSidebarFields({
  fields,
  onFieldChange,
  categories,
  tags,
  selectedTagIds,
  onToggleTag,
  fieldErrors,
}: PostSidebarFieldsProps) {
  const selectedCategory = fields.categoryId === "" || fields.categoryId === NO_CATEGORY_VALUE ? "" : fields.categoryId;

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[14px] font-black">{POST_FORM_LABELS.categoryLabel}</CardTitle>
          <p className="text-xs leading-5 text-muted-foreground">{POST_FORM_LABELS.categoryHint}</p>
        </CardHeader>
        <CardContent>
          <div
            role="radiogroup"
            aria-label={POST_FORM_LABELS.categoryLabel}
            className="space-y-0.5 rounded-xl border border-border/60 bg-muted/25 p-1.5"
          >
            <CategoryRadio
              label={POST_FORM_LABELS.noCategory}
              depth={0}
              checked={selectedCategory === ""}
              onSelect={() => onFieldChange("categoryId", NO_CATEGORY_VALUE)}
            />
            {categories.map((category) => (
              <CategoryRadio
                key={category.id}
                label={category.name}
                depth={category.depth}
                checked={selectedCategory === String(category.id)}
                onSelect={() => onFieldChange("categoryId", String(category.id))}
              />
            ))}
          </div>
          <FieldError errorId="post-category-error" message={fieldErrors.categoryId} />
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
