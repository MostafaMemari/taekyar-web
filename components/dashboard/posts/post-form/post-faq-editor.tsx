"use client";

import { useState, useTransition, useOptimistic } from "react";
import { ArrowDown, ArrowUp, ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/dashboard/shared/confirm-dialog";
import { DashboardEmptyState } from "@/components/dashboard/shared/dashboard-empty-state";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/shared/form-controls";
import { POST_FAQ_LABELS } from "@/data/dashboard/faqs";
import type { FaqInput } from "@/lib/admin-types";
import { savePostFaqs } from "@/lib/admin-actions";
import { cn } from "@/lib/utils";

type PostFaqEditorProps =
  | { mode: "create"; value: FaqInput[]; onChange: (next: FaqInput[]) => void }
  | { mode: "edit"; postSlug: string; initialFaqs: FaqInput[] };

const NO_FAQS: FaqInput[] = [];

export function PostFaqEditor(props: PostFaqEditorProps) {
  const { mode } = props;
  const [isPending, startTransition] = useTransition();
  const [optimisticFaqs, setOptimisticFaqs] = useOptimistic(
    mode === "edit" ? props.initialFaqs : NO_FAQS,
    (_state, next: FaqInput[]) => next,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionError, setQuestionError] = useState<string | undefined>();
  const [answerError, setAnswerError] = useState<string | undefined>();

  const faqs = mode === "create" ? props.value : optimisticFaqs;

  function commit(next: FaqInput[]) {
    if (props.mode === "create") {
      props.onChange(next);
      return;
    }
    startTransition(async () => {
      setOptimisticFaqs(next);
      const result = await savePostFaqs(props.postSlug, next);
      if (result.ok) {
        toast({ tone: "success", title: POST_FAQ_LABELS.saved });
      } else {
        toast({ tone: "error", title: POST_FAQ_LABELS.saveError });
      }
    });
  }

  function openCreate() {
    setEditingIndex(null);
    setQuestion("");
    setAnswer("");
    setQuestionError(undefined);
    setAnswerError(undefined);
    setDialogOpen(true);
  }

  function openEdit(index: number) {
    const item = faqs[index];
    if (!item) return;
    setEditingIndex(index);
    setQuestion(item.question);
    setAnswer(item.answer);
    setQuestionError(undefined);
    setAnswerError(undefined);
    setDialogOpen(true);
  }

  function handleDialogChange(next: boolean) {
    if (isPending && !next) return;
    if (next) {
      setQuestion("");
      setAnswer("");
      setQuestionError(undefined);
      setAnswerError(undefined);
      setEditingIndex(null);
    }
    setDialogOpen(next);
  }

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();
    const nextQuestionError = trimmedQuestion ? undefined : POST_FAQ_LABELS.questionRequired;
    const nextAnswerError = trimmedAnswer ? undefined : POST_FAQ_LABELS.answerRequired;
    setQuestionError(nextQuestionError);
    setAnswerError(nextAnswerError);
    if (nextQuestionError || nextAnswerError) return;

    const next = [...faqs];
    if (editingIndex === null) {
      next.push({ question: trimmedQuestion, answer: trimmedAnswer });
    } else {
      next[editingIndex] = { question: trimmedQuestion, answer: trimmedAnswer };
    }
    commit(next);
    setDialogOpen(false);
  }

  function handleMove(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= faqs.length) return;
    const next = [...faqs];
    [next[index], next[target]] = [next[target], next[index]];
    commit(next);
    setExpandedIndex(null);
  }

  function handleDelete(index: number) {
    commit(faqs.filter((_, itemIndex) => itemIndex !== index));
    setExpandedIndex(null);
  }

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-[15px] font-black">{POST_FAQ_LABELS.sectionTitle}</CardTitle>
        <CardDescription className="text-xs leading-5">
          {POST_FAQ_LABELS.sectionDescription}
        </CardDescription>
        <CardAction>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={openCreate}
            className="gap-1.5 rounded-lg font-bold"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            {POST_FAQ_LABELS.addItem}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="pt-1">
        {faqs.length === 0 ? (
          <DashboardEmptyState
            title={POST_FAQ_LABELS.empty}
            hint={POST_FAQ_LABELS.emptyHint}
            action={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openCreate}
                className="gap-1.5 rounded-lg font-bold"
              >
                <Plus className="size-3.5" aria-hidden="true" />
                {POST_FAQ_LABELS.addItem}
              </Button>
            }
          />
        ) : (
          <div className="divide-y divide-border/60">
            {faqs.map((item, index) => (
              <div key={index}>
                <div className="group flex items-center gap-1.5 py-1">
                  <button
                    type="button"
                    onClick={() => setExpandedIndex((previous) => (previous === index ? null : index))}
                    aria-expanded={expandedIndex === index}
                    data-state={expandedIndex === index ? "open" : undefined}
                    title={item.question}
                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-1 rounded-lg py-1.5 text-start text-[13px] font-bold leading-6 text-foreground outline-none transition-colors hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=open]:text-primary"
                  >
                    <span className="line-clamp-1 min-w-0 flex-1">{item.question}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
                        expandedIndex === index && "rotate-180 text-primary",
                      )}
                    />
                  </button>
                  <div className="flex shrink-0 items-center gap-0.5 opacity-70 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      disabled={isPending || index === 0}
                      aria-label={POST_FAQ_LABELS.moveUp}
                      onClick={() => handleMove(index, -1)}
                    >
                      <ArrowUp className="size-3" aria-hidden="true" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      disabled={isPending || index === faqs.length - 1}
                      aria-label={POST_FAQ_LABELS.moveDown}
                      onClick={() => handleMove(index, 1)}
                    >
                      <ArrowDown className="size-3" aria-hidden="true" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      disabled={isPending}
                      aria-label={POST_FAQ_LABELS.editItem}
                      onClick={() => openEdit(index)}
                    >
                      <Pencil className="size-3" aria-hidden="true" />
                    </Button>
                    <ConfirmDialog
                      destructive
                      title={POST_FAQ_LABELS.deleteTitle}
                      description={POST_FAQ_LABELS.deleteConfirm}
                      confirmLabel={POST_FAQ_LABELS.deleteItem}
                      cancelLabel={POST_FAQ_LABELS.cancel}
                      onConfirm={async () => handleDelete(index)}
                      trigger={
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          disabled={isPending}
                          aria-label={POST_FAQ_LABELS.deleteItem}
                        >
                          <Trash2 className="size-3" aria-hidden="true" />
                        </Button>
                      }
                    />
                  </div>
                </div>
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-200 ease-in-out motion-reduce:transition-none",
                    expandedIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pb-2.5 pe-8 text-xs leading-6 text-muted-foreground">{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingIndex === null ? POST_FAQ_LABELS.addItem : POST_FAQ_LABELS.editItem}
            </DialogTitle>
            <DialogDescription>{POST_FAQ_LABELS.sectionDescription}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} noValidate className="space-y-4">
            <div>
              <Label htmlFor="post-faq-question">{POST_FAQ_LABELS.questionLabel}</Label>
              <Input
                id="post-faq-question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder={POST_FAQ_LABELS.questionPlaceholder}
                aria-invalid={Boolean(questionError)}
                aria-describedby={questionError ? "post-faq-question-error" : undefined}
                className="mt-1.5"
              />
              <FieldError errorId="post-faq-question-error" message={questionError} />
            </div>
            <div>
              <Label htmlFor="post-faq-answer">{POST_FAQ_LABELS.answerLabel}</Label>
              <Textarea
                id="post-faq-answer"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder={POST_FAQ_LABELS.answerPlaceholder}
                rows={5}
                aria-invalid={Boolean(answerError)}
                aria-describedby={answerError ? "post-faq-answer-error" : undefined}
                className="mt-1.5 leading-7"
              />
              <FieldError errorId="post-faq-answer-error" message={answerError} />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => handleDialogChange(false)}
                className="h-10 rounded-xl px-5 text-[13px] font-bold"
              >
                {POST_FAQ_LABELS.cancel}
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="h-10 gap-1.5 rounded-xl px-5 text-[13px] font-bold"
              >
                {isPending ? POST_FAQ_LABELS.saving : POST_FAQ_LABELS.save}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
