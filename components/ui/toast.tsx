"use client";

import * as React from "react";
import { Toast as ToastPrimitive } from "radix-ui";
import { CircleCheck, TriangleAlert, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useToast, type ToastTone } from "./use-toast";

const TONE_CLASSES: Record<ToastTone, string> = {
  success: "bg-belt-green/15 text-belt-green ring-belt-green/25",
  error: "bg-destructive/10 text-destructive ring-destructive/25",
};

const TONE_ICONS: Record<ToastTone, React.ReactNode> = {
  success: <CircleCheck />,
  error: <TriangleAlert />,
};

/**
 * Light-theme surface tokens are pinned here because Radix portals the
 * toast viewport to <body>, outside every `.theme-light` scope.
 */
function Toast({ tone, className, ...props }: React.ComponentProps<typeof ToastPrimitive.Root> & { tone: ToastTone }) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      data-tone={tone}
      className={cn(
        "pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl bg-white p-4 shadow-lg shadow-black/[0.08] ring-1 ring-black/[0.05]",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-6",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        "data-[swipe=end]:animate-out data-[swipe=end]:fade-out-0",
        className,
      )}
      {...props}
    />
  );
}

function ToastTitle({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Title>) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("text-sm font-extrabold leading-7", className)}
      {...props}
    />
  );
}

function ToastDescription({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Description>) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("mt-1 text-[13px] leading-6 opacity-80 sm:text-sm", className)}
      {...props}
    />
  );
}

/** Success-to-error tinting for the leading icon, driven by the `tone` prop. */
function ToastLeadingIcon({ tone }: { tone: ToastTone }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full ring-1 [&_svg]:size-4",
        TONE_CLASSES[tone],
      )}
    >
      {TONE_ICONS[tone]}
    </span>
  );
}

function ToastClose({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Close>) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="بستن اعلان"
      className={cn(
        "flex size-6 shrink-0 items-center justify-center self-start rounded-md opacity-50 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
      {...props}
    >
      <X className="size-4" />
    </ToastPrimitive.Close>
  );
}

function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastPrimitive.Provider swipeDirection="left" label="اعلان">
      {toasts.map(({ id, tone, title, description }) => (
        <Toast key={id} tone={tone} onOpenChange={(open) => !open && dismiss(id)}>
          <ToastLeadingIcon tone={tone} />
          <div className="min-w-0 flex-1">
            <ToastTitle>{title}</ToastTitle>
            {description ? <ToastDescription>{description}</ToastDescription> : null}
          </div>
          <ToastClose />
        </Toast>
      ))}

      <ToastPrimitive.Viewport
        data-slot="toast-viewport"
        tabIndex={-1}
        className={cn(
          "fixed bottom-0 inset-x-0 z-[100] m-0 flex list-none flex-col gap-2 p-4 outline-none",
          "sm:inset-x-auto sm:end-0 sm:max-w-[380px] [--radix-toast-swipe-end-x:-100%]",
        )}
      />
    </ToastPrimitive.Provider>
  );
}

export { Toast, ToastTitle, ToastDescription, ToastClose, ToastLeadingIcon, Toaster };
