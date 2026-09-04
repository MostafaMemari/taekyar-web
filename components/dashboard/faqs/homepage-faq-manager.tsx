"use client";

import { useOptimistic, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/dashboard/shared/confirm-dialog";
import { DashboardEmptyState } from "@/components/dashboard/shared/dashboard-empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FAQ_LABELS } from "@/data/dashboard/faqs";
import {
  deleteHomepageFaq,
  reorderHomepageFaqs,
  toggleHomepageFaq,
} from "@/lib/admin-actions";
import { toast } from "@/hooks/use-toast";
import { FaqDialog, type FaqDialogValue } from "./faq-dialog";

export interface HomepageFaqItem {
  id: number;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

const EMPTY_VALUE: FaqDialogValue = { question: "", answer: "", isActive: true };

export function HomepageFaqManager({ initialFaqs }: { initialFaqs: HomepageFaqItem[] }) {
  const [faqs, setOptimisticFaqs] = useOptimistic(
    initialFaqs,
    (_state, next: HomepageFaqItem[]) => next,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<HomepageFaqItem | null>(null);
  const [isPending, startTransition] = useTransition();

  function openCreate() {
    setEditingFaq(null);
    setDialogOpen(true);
  }

  function openEdit(faq: HomepageFaqItem) {
    setEditingFaq(faq);
    setDialogOpen(true);
  }

  function handleDialogChange(open: boolean) {
    setDialogOpen(open);
    if (!open) setEditingFaq(null);
  }

  function handleToggle(faq: HomepageFaqItem) {
    const next = !faq.isActive;
    startTransition(async () => {
      setOptimisticFaqs(faqs.map((item) => (item.id === faq.id ? { ...item, isActive: next } : item)));
      const result = await toggleHomepageFaq(faq.id, next);
      if (result.ok) {
        toast({ tone: "success", title: FAQ_LABELS.statusChanged });
      } else {
        toast({ tone: "error", title: FAQ_LABELS.statusError });
      }
    });
  }

  function handleMove(faq: HomepageFaqItem, direction: -1 | 1) {
    const index = faqs.findIndex((item) => item.id === faq.id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= faqs.length) return;
    const next = [...faqs];
    [next[index], next[target]] = [next[target], next[index]];
    startTransition(async () => {
      setOptimisticFaqs(next);
      const result = await reorderHomepageFaqs(next.map((item) => item.id));
      if (!result.ok) {
        toast({ tone: "error", title: FAQ_LABELS.reorderError });
      }
    });
  }

  async function handleDelete(faq: HomepageFaqItem) {
    setOptimisticFaqs(faqs.filter((item) => item.id !== faq.id));
    const result = await deleteHomepageFaq(faq.id);
    if (result.ok) {
      toast({ tone: "success", title: FAQ_LABELS.deleted });
    } else {
      toast({ tone: "error", title: FAQ_LABELS.deleteError });
    }
  }

  return (
    <Card className="p-0">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
        <CardTitle className="text-[15px] font-black">{FAQ_LABELS.listTitle}</CardTitle>
        <Button
          type="button"
          onClick={openCreate}
          className="h-10 gap-2 rounded-xl px-4 text-[13px] font-bold shadow-md shadow-primary/15"
        >
          <Plus className="size-4" aria-hidden="true" />
          {FAQ_LABELS.newFaq}
        </Button>
      </CardHeader>

      {faqs.length === 0 ? (
        <DashboardEmptyState
          title={FAQ_LABELS.listEmpty}
          hint={FAQ_LABELS.listEmptyHint}
          action={
            <Button
              type="button"
              onClick={openCreate}
              className="h-9 gap-2 rounded-xl px-4 text-[13px] font-bold"
            >
              <Plus className="size-4" aria-hidden="true" />
              {FAQ_LABELS.newFaq}
            </Button>
          }
        />
      ) : (
        <CardContent className="space-y-3 p-4 pt-0 sm:p-5 sm:pt-0">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="rounded-2xl bg-muted/30 p-4 ring-1 ring-border/50 transition-colors hover:bg-muted/50"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="min-w-0 flex-1 text-[14px] font-bold leading-7 text-foreground">
                  {faq.question}
                </p>
                <Badge variant={faq.isActive ? "default" : "secondary"} className="shrink-0">
                  {faq.isActive ? FAQ_LABELS.showLabel : FAQ_LABELS.hideLabel}
                </Badge>
              </div>
              <p className="mt-1.5 line-clamp-2 text-[13px] leading-6 text-muted-foreground">
                {faq.answer}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={isPending || index === 0}
                  aria-label={FAQ_LABELS.moveUp}
                  onClick={() => handleMove(faq, -1)}
                >
                  <ArrowUp className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={isPending || index === faqs.length - 1}
                  aria-label={FAQ_LABELS.moveDown}
                  onClick={() => handleMove(faq, 1)}
                >
                  <ArrowDown className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={isPending}
                  aria-label={faq.isActive ? FAQ_LABELS.hideLabel : FAQ_LABELS.showLabel}
                  onClick={() => handleToggle(faq)}
                >
                  {faq.isActive ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={isPending}
                  aria-label={FAQ_LABELS.edit}
                  onClick={() => openEdit(faq)}
                >
                  <Pencil className="size-4" aria-hidden="true" />
                </Button>
                <ConfirmDialog
                  destructive
                  title={FAQ_LABELS.deleteTitle}
                  description={FAQ_LABELS.deleteConfirm}
                  confirmLabel={FAQ_LABELS.delete}
                  cancelLabel={FAQ_LABELS.cancel}
                  onConfirm={() => handleDelete(faq)}
                  trigger={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={isPending}
                      aria-label={FAQ_LABELS.delete}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  }
                />
              </div>
            </div>
          ))}
        </CardContent>
      )}

      <FaqDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        faqId={editingFaq?.id ?? null}
        initial={
          editingFaq
            ? { question: editingFaq.question, answer: editingFaq.answer, isActive: editingFaq.isActive }
            : EMPTY_VALUE
        }
      />
    </Card>
  );
}
