"use client";

import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/dashboard/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { MEDIA_LABELS } from "@/data/dashboard/ui";
import { toast } from "@/hooks/use-toast";
import { deleteMedia } from "@/lib/admin-actions";

interface DeleteMediaButtonProps {
  mediaKey: string;
}

export function DeleteMediaButton({ mediaKey }: DeleteMediaButtonProps) {
  const router = useRouter();

  return (
    <ConfirmDialog
      destructive
      title={MEDIA_LABELS.deleteTitle}
      description={MEDIA_LABELS.confirmDelete}
      confirmLabel={MEDIA_LABELS.delete}
      onConfirm={async () => {
        const result = await deleteMedia(mediaKey);
        if (result.ok) {
          toast({ tone: "success", title: MEDIA_LABELS.deleted });
          router.refresh();
        } else {
          toast({ tone: "error", title: MEDIA_LABELS.deleteError });
        }
      }}
      trigger={
        <Button
          variant="destructive"
          className="h-9 w-full gap-1.5 rounded-lg px-3 text-[12px] font-bold"
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
          {MEDIA_LABELS.delete}
        </Button>
      }
    />
  );
}
