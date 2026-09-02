"use client";

import { useState, useTransition } from "react";
import { ChevronDown, Link2, Pencil, Plus, Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/dashboard/shared/confirm-dialog";
import { FieldError } from "@/components/shared/form-controls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MENUS_LABELS } from "@/data/dashboard/ui";
import { createMenuItem, deleteMenuItem, moveMenuItem, updateMenuItem } from "@/lib/admin-actions";
import type {
  MenuItemFieldErrors,
  MenuItemInput,
  MenuItemOption,
  MenuItemRowDto,
  MenuItemTypeDto,
  MenuLocationDto,
} from "@/lib/admin-types";
import type { MenuLinkTargets } from "@/lib/admin/menu-targets";
import { toast } from "@/hooks/use-toast";

const TYPE_ORDER: MenuItemTypeDto[] = ["PAGE", "POST", "CATEGORY", "TAG", "CUSTOM"];

function targetName(item: MenuItemRowDto, targets: MenuLinkTargets): string {
  switch (item.type) {
    case "PAGE":
      return targets.pages.find((page) => page.id === item.pageId)?.name ?? "—";
    case "POST":
      return targets.posts.find((post) => post.id === item.postId)?.name ?? "—";
    case "CATEGORY":
      return targets.categories.find((category) => category.id === item.categoryId)?.name ?? "—";
    case "TAG":
      return targets.tags.find((tag) => tag.id === item.tagId)?.name ?? "—";
    case "CUSTOM":
      return item.customUrl ?? "—";
  }
}

interface MenuManagerProps {
  location: MenuLocationDto;
  items: MenuItemRowDto[];
  targets: MenuLinkTargets;
}

export function MenuManager({ location, items, targets }: MenuManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItemRowDto | null>(null);
  const [parentOfNew, setParentOfNew] = useState<MenuItemRowDto | null>(null);

  const roots = items.filter((item) => item.parentId === null);
  const childrenOf = (parentId: number) => items.filter((item) => item.parentId === parentId);

  function openCreate(parent: MenuItemRowDto | null) {
    setEditing(null);
    setParentOfNew(parent);
    setDialogOpen(true);
  }

  function openEdit(item: MenuItemRowDto) {
    setEditing(item);
    setParentOfNew(null);
    setDialogOpen(true);
  }

  function move(id: number, direction: "up" | "down") {
    startTransition(async () => {
      const result = await moveMenuItem(id, direction);
      if (!result.ok) toast({ tone: "error", title: MENUS_LABELS.moveUpError });
    });
  }

  function remove(id: number) {
    startTransition(async () => {
      const result = await deleteMenuItem(id);
      if (result.ok) toast({ tone: "success", title: MENUS_LABELS.deleted });
      else toast({ tone: "error", title: MENUS_LABELS.deleteError });
    });
  }

  function renderRow(item: MenuItemRowDto, depth: number) {
    const children = childrenOf(item.id);

    return (
      <li key={item.id}>
        <div
          className="flex flex-wrap items-center gap-2 rounded-xl bg-card px-3 py-2.5 ring-1 ring-black/[0.05]"
          style={depth > 0 ? { marginInlineStart: `${depth * 1.25}rem` } : undefined}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-[13px] font-bold text-foreground">{item.title}</span>
              <span className="inline-flex shrink-0 items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                {MENUS_LABELS.types[item.type]}
              </span>
            </div>
            <span dir="ltr" className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground">
              <Link2 className="size-3 shrink-0" aria-hidden="true" />
              {targetName(item, targets)}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={MENUS_LABELS.moveUp}
              disabled={isPending}
              className="size-8 rounded-lg"
              onClick={() => move(item.id, "up")}
            >
              <ChevronDown className="size-4 rotate-180" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={MENUS_LABELS.moveDown}
              disabled={isPending}
              className="size-8 rounded-lg"
              onClick={() => move(item.id, "down")}
            >
              <ChevronDown className="size-4" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={MENUS_LABELS.editItem}
              className="size-8 rounded-lg"
              onClick={() => openEdit(item)}
            >
              <Pencil className="size-4" aria-hidden="true" />
            </Button>
            {depth === 0 ? (
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={MENUS_LABELS.addChild}
                className="size-8 rounded-lg"
                onClick={() => openCreate(item)}
              >
                <Plus className="size-4" aria-hidden="true" />
              </Button>
            ) : null}
            <ConfirmDialog
              destructive
              title={MENUS_LABELS.deleteTitle}
              description={MENUS_LABELS.deleteConfirm}
              confirmLabel={MENUS_LABELS.delete}
              onConfirm={async () => remove(item.id)}
              trigger={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={MENUS_LABELS.delete}
                  className="size-8 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </Button>
              }
            />
          </div>
        </div>

        {children.length > 0 ? <ul className="mt-1.5 space-y-1.5">{children.map((child) => renderRow(child, depth + 1))}</ul> : null}
      </li>
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-[14px] font-black">{MENUS_LABELS.locations[location]}</CardTitle>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{MENUS_LABELS.maxDepthHint}</p>
        </div>
        <Button className="h-9 gap-2 rounded-xl px-4 text-[12px] font-bold" onClick={() => openCreate(null)}>
          <Plus className="size-4" aria-hidden="true" />
          {MENUS_LABELS.addItem}
        </Button>
      </CardHeader>
      <CardContent>
        {roots.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 px-4 py-10 text-center">
            <p className="text-[13px] font-bold text-foreground">{MENUS_LABELS.empty}</p>
            <p className="mt-1 text-xs text-muted-foreground">{MENUS_LABELS.emptyHint}</p>
          </div>
        ) : (
          <ul className="space-y-1.5">{roots.map((item) => renderRow(item, 0))}</ul>
        )}
      </CardContent>

      <MenuItemDialog
        key={`${dialogOpen}-${editing?.id ?? "new"}-${parentOfNew?.id ?? "root"}`}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        location={location}
        targets={targets}
        editing={editing}
        parentId={parentOfNew?.id ?? null}
        parentTitle={parentOfNew?.title ?? null}
      />
    </Card>
  );
}

interface MenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: MenuLocationDto;
  targets: MenuLinkTargets;
  editing: MenuItemRowDto | null;
  parentId: number | null;
  parentTitle: string | null;
}
interface DialogDraft {
  title: string;
  type: MenuItemTypeDto;
  pageId: string;
  postId: string;
  categoryId: string;
  tagId: string;
  customUrl: string;
}

function draftFrom(editing: MenuItemRowDto | null): DialogDraft {
  if (!editing) {
    return { title: "", type: "PAGE", pageId: "", postId: "", categoryId: "", tagId: "", customUrl: "" };
  }
  return {
    title: editing.title,
    type: editing.type,
    pageId: editing.pageId === null ? "" : String(editing.pageId),
    postId: editing.postId === null ? "" : String(editing.postId),
    categoryId: editing.categoryId === null ? "" : String(editing.categoryId),
    tagId: editing.tagId === null ? "" : String(editing.tagId),
    customUrl: editing.customUrl ?? "",
  };
}

function MenuItemDialog({ open, onOpenChange, location, targets, editing, parentId, parentTitle }: MenuItemDialogProps) {
  const [draft, setDraft] = useState<DialogDraft>(() => draftFrom(editing));
  const [fieldErrors, setFieldErrors] = useState<MenuItemFieldErrors>({});
  const [isPending, startTransition] = useTransition();

  function setField<K extends keyof DialogDraft>(key: K, value: DialogDraft[K]) {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setFieldErrors((previous) => ({ ...previous, [key === "customUrl" ? "customUrl" : key]: undefined }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input: MenuItemInput = {
      title: draft.title,
      type: draft.type,
      pageId: draft.type === "PAGE" && draft.pageId ? Number(draft.pageId) : null,
      postId: draft.type === "POST" && draft.postId ? Number(draft.postId) : null,
      categoryId: draft.type === "CATEGORY" && draft.categoryId ? Number(draft.categoryId) : null,
      tagId: draft.type === "TAG" && draft.tagId ? Number(draft.tagId) : null,
      customUrl: draft.type === "CUSTOM" ? draft.customUrl : null,
      parentId,
      location,
    };

    setFieldErrors({});
    startTransition(async () => {
      const result = editing
        ? await updateMenuItem(editing.id, input)
        : await createMenuItem(input);
      if (result.status === "error") {
        setFieldErrors(result.fieldErrors ?? {});
        if (result.message) toast({ tone: "error", title: MENUS_LABELS.saveError, description: result.message });
        return;
      }
      toast({ tone: "success", title: MENUS_LABELS.saved });
      onOpenChange(false);
    });
  }

  const optionsFor = (type: MenuItemTypeDto): MenuItemOption[] => {
    switch (type) {
      case "PAGE":
        return targets.pages;
      case "POST":
        return targets.posts;
      case "CATEGORY":
        return targets.categories;
      case "TAG":
        return targets.tags;
      default:
        return [];
    }
  };

  const idPrefix = editing ? "menu-item-edit" : "menu-item-new";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? MENUS_LABELS.editItem : MENUS_LABELS.addItem}</DialogTitle>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          {parentId !== null && parentTitle ? (
            <p className="rounded-xl bg-muted/50 px-3 py-2 text-xs font-bold text-muted-foreground">
              {MENUS_LABELS.addChild}: «{parentTitle}»
            </p>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor={`${idPrefix}-title`} className="text-[13px] font-bold">
              {MENUS_LABELS.titleLabel}
            </Label>
            <Input
              id={`${idPrefix}-title`}
              required
              value={draft.title}
              placeholder={MENUS_LABELS.titlePlaceholder}
              className="h-10 rounded-xl"
              aria-invalid={Boolean(fieldErrors.title)}
              aria-describedby={fieldErrors.title ? `${idPrefix}-title-error` : undefined}
              onChange={(event) => setField("title", event.target.value)}
            />
            <FieldError errorId={`${idPrefix}-title-error`} message={fieldErrors.title} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${idPrefix}-type`} className="text-[13px] font-bold">
              {MENUS_LABELS.typeLabel}
            </Label>
            <Select value={draft.type} onValueChange={(value) => setField("type", value as MenuItemTypeDto)}>
              <SelectTrigger id={`${idPrefix}-type`} className="h-10 w-full rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPE_ORDER.map((type) => (
                  <SelectItem key={type} value={type}>
                    {MENUS_LABELS.types[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {draft.type === "CUSTOM" ? (
            <div className="space-y-1.5">
              <Label htmlFor={`${idPrefix}-url`} className="text-[13px] font-bold">
                {MENUS_LABELS.customUrlLabel}
              </Label>
              <Input
                id={`${idPrefix}-url`}
                dir="ltr"
                required
                value={draft.customUrl}
                placeholder={MENUS_LABELS.customUrlPlaceholder}
                className="h-10 rounded-xl text-start font-mono text-sm"
                aria-invalid={Boolean(fieldErrors.customUrl)}
                aria-describedby={fieldErrors.customUrl ? `${idPrefix}-url-error` : undefined}
                onChange={(event) => setField("customUrl", event.target.value)}
              />
              <FieldError errorId={`${idPrefix}-url-error`} message={fieldErrors.customUrl} />
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor={`${idPrefix}-target`} className="text-[13px] font-bold">
                {MENUS_LABELS.targetLabel}
              </Label>
              <Select
                required
                value={draft[draft.type === "PAGE" ? "pageId" : draft.type === "POST" ? "postId" : draft.type === "CATEGORY" ? "categoryId" : "tagId"]}
                onValueChange={(value) =>
                  setField(
                    draft.type === "PAGE" ? "pageId" : draft.type === "POST" ? "postId" : draft.type === "CATEGORY" ? "categoryId" : "tagId",
                    value,
                  )
                }
              >
                <SelectTrigger id={`${idPrefix}-target`} className="h-10 w-full rounded-xl">
                  <SelectValue placeholder={MENUS_LABELS.targetPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {optionsFor(draft.type).map((option) => (
                    <SelectItem key={option.id} value={String(option.id)}>
                      {"— ".repeat(option.depth ?? 0)}
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errorId={`${idPrefix}-target-error`} message={fieldErrors.target} />
            </div>
          )}

          <DialogFooter className="gap-2 pt-1">
            <Button type="button" variant="outline" className="h-10 rounded-xl px-5 text-sm font-bold" onClick={() => onOpenChange(false)}>
              انصراف
            </Button>
            <Button type="submit" disabled={isPending} className="h-10 rounded-xl px-6 text-sm font-bold">
              {editing ? "ذخیره تغییرات" : MENUS_LABELS.addItem}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
