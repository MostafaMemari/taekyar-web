"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
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
import { FAQ_LABELS } from "@/data/dashboard/faqs";
import type { FaqFieldErrors, HomepageFaqInput } from "@/lib/admin-types";
import { createHomepageFaq, updateHomepageFaq } from "@/lib/admin-actions";
import { toast } from "@/hooks/use-toast";

export interface FaqDialogValue {
  question: string;
  answer: string;
  isActive: boolean;
}

interface FaqDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faqId: number | null;
  initial: FaqDialogValue;
}

export function FaqDialog({ open, onOpenChange, faqId, initial }: FaqDialogProps) {
  const router = useRouter();
  const [question, setQuestion] = useState(initial.question);
  const [answer, setAnswer] = useState(initial.answer);
  const [isActive, setIsActive] = useState(initial.isActive);
  const [fieldErrors, setFieldErrors] = useState<FaqFieldErrors>({});
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(next: boolean) {
    if (!isPending) {
      if (next) {
        setQuestion(initial.question);
        setAnswer(initial.answer);
        setIsActive(initial.isActive);
        setFieldErrors({});
      }
      onOpenChange(next);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input: HomepageFaqInput = {
      question: question.trim(),
      answer: answer.trim(),
      isActive,
    };
    setFieldErrors({});
    startTransition(async () => {
      const result =
        faqId === null
          ? await createHomepageFaq({ status: "idle" }, input)
          : await updateHomepageFaq({ status: "idle" }, { ...input, id: faqId });
      if (result.status === "error") {
        setFieldErrors(result.fieldErrors ?? {});
        toast({
          tone: "error",
          title: FAQ_LABELS.errorToastTitle,
          description: result.message ?? FAQ_LABELS.saveError,
        });
        return;
      }
      toast({
        tone: "success",
        title: faqId === null ? FAQ_LABELS.created : FAQ_LABELS.updated,
      });
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{faqId === null ? FAQ_LABELS.createTitle : FAQ_LABELS.editTitle}</DialogTitle>
          <DialogDescription>
            {faqId === null ? FAQ_LABELS.createDescription : FAQ_LABELS.editDescription}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <Label htmlFor="faq-question">{FAQ_LABELS.questionLabel}</Label>
            <Input
              id="faq-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder={FAQ_LABELS.questionPlaceholder}
              aria-invalid={Boolean(fieldErrors.question)}
              aria-describedby={fieldErrors.question ? "faq-question-error" : undefined}
              className="mt-1.5"
            />
            <FieldError errorId="faq-question-error" message={fieldErrors.question} />
          </div>
          <div>
            <Label htmlFor="faq-answer">{FAQ_LABELS.answerLabel}</Label>
            <Textarea
              id="faq-answer"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder={FAQ_LABELS.answerPlaceholder}
              rows={5}
              aria-invalid={Boolean(fieldErrors.answer)}
              aria-describedby={fieldErrors.answer ? "faq-answer-error" : undefined}
              className="mt-1.5 leading-7"
            />
            <FieldError errorId="faq-answer-error" message={fieldErrors.answer} />
          </div>
          <label className="flex cursor-pointer items-center gap-2.5 text-[13px] font-bold text-foreground">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
              className="size-4 accent-primary"
            />
            {FAQ_LABELS.activeLabel}
          </label>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => handleOpenChange(false)}
              className="h-10 rounded-xl px-5 text-[13px] font-bold"
            >
              {FAQ_LABELS.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-10 rounded-xl px-5 text-[13px] font-bold"
            >
              {isPending ? FAQ_LABELS.saving : FAQ_LABELS.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
