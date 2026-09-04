"use client";

import { useState, useTransition, useOptimistic } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/dashboard/shared/confirm-dialog";
import { DashboardEmptyState } from "@/components/dashboard/shared/dashboard-empty-state";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  function handleDialogClose(next: boolean) {
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
    if (mode === "create") handleDialogClose(false);
  }

  function handleMove(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= faqs.length) return;
    const next = [...faqs];
    [next[index], next[target]] = [next[target], next[index]];
    commit(next);
  }

  function handleDelete(index: number) {
    commit(faqs.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle className="text-[15px] font-black">{POST_FAQ_LABELS.sectionTitle}</CardTitle>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {POST_FAQ_LABELS.sectionDescription}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={openCreate}
          className="h-9 gap-2 rounded-xl px-4 text-[12px] font-bold"
        >
          <Plus className="size-4" aria-hidden="true" />
          {POST_FAQ_LABELS.addItem}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {faqs.length === 0 ? (
          <DashboardEmptyState
            title={POST_FAQ_LABELS.empty}
            hint={POST_FAQ_LABELS.emptyHint}
            action={
              <Button
                type="button"
                variant="outline"
                onClick={openCreate}
                className="h-9 gap-2 rounded-xl px-4 text-[12px] font-bold"
              >
                <Plus className="size-4" aria-hidden="true" />
                {POST_FAQ_LABELS.addItem}
              </Button>
            }
          />
        ) : (
          faqs.map((item, index) => (
            <div
              key={index}
              className="rounded-xl bg-muted/30 p-3.5 ring-1 ring-border/50 transition-colors hover:bg-muted/50"
            >
              <p className="text-[13px] font-bold leading-6 text-foreground">{item.question}</p>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{item.answer}</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={isPending || index === 0}
                  aria-label={POST_FAQ_LABELS.moveUp}
                  onClick={() => handleMove(index, -1)}
                >
                  <ArrowUp className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={isPending || index === faqs.length - 1}
                  aria-label={POST_FAQ_LABELS.moveDown}
                  onClick={() => handleMove(index, 1)}
                >
                  <ArrowDown className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={isPending}
                  aria-label={POST_FAQ_LABELS.editItem}
                  onClick={() => openEdit(index)}
                >
                  <Pencil className="size-4" aria-hidden="true" />
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
                      size="icon-sm"
                      disabled={isPending}
                      aria-label={POST_FAQ_LABELS.deleteItem}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  }
                />
              </div>
            </div>
          ))
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
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
                onClick={() => handleDialogClose(false)}
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
