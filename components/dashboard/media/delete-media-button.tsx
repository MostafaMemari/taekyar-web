"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MEDIA_LABELS } from "@/data/dashboard/ui";
import { toast } from "@/hooks/use-toast";
import { deleteMedia } from "@/lib/admin-actions";

interface DeleteMediaButtonProps {
  mediaKey: string;
}

export function DeleteMediaButton({ mediaKey }: DeleteMediaButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="destructive"
      disabled={isPending}
      className="h-9 w-full gap-1.5 rounded-lg px-3 text-[12px] font-bold"
      onClick={() => {
        if (!window.confirm(MEDIA_LABELS.confirmDelete)) return;

        startTransition(async () => {
          const result = await deleteMedia(mediaKey);
          if (result.ok) {
            toast({ tone: "success", title: MEDIA_LABELS.deleted });
            router.refresh();
          } else {
            toast({ tone: "error", title: MEDIA_LABELS.deleteError });
          }
        });
      }}
    >
      {isPending ? (
        <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
      ) : (
        <Trash2 className="size-3.5" aria-hidden="true" />
      )}
      {MEDIA_LABELS.delete}
    </Button>
  );
}
