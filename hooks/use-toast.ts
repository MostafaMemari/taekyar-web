"use client";

import * as React from "react";

export type ToastTone = "success" | "error";

interface ToastItem {
  id: string;
  tone: ToastTone;
  title: string;
  description?: string;
}

interface ToastInput {
  tone: ToastTone;
  title: string;
  description?: string;
}

type ToastAction =
  | { type: "ADD_TOAST"; toast: ToastItem }
  | { type: "DISMISS_TOAST"; toastId: string };

const TOAST_LIMIT = 1;

/** Imperative emitter so non-component code (or any client component) can fire toasts. */
let listeners: Array<(toasts: ToastItem[]) => void> = [];
let memoryToasts: ToastItem[] = [];

function emit() {
  for (const listener of listeners) listener(memoryToasts);
}

function dispatch(action: ToastAction) {
  if (action.type === "ADD_TOAST") {
    memoryToasts = [action.toast, ...memoryToasts].slice(0, TOAST_LIMIT);
    emit();
    return;
  }

  memoryToasts = memoryToasts.filter((toast) => toast.id !== action.toastId);
  emit();
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastItem[]>(memoryToasts);

  React.useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter((listener) => listener !== setToasts);
    };
  }, []);

  return {
    toasts,
    dismiss(toastId: string) {
      dispatch({ type: "DISMISS_TOAST", toastId });
    },
  };
}

let toastCounter = 0;

function createToastId() {
  toastCounter += 1;
  return `toast-${toastCounter}`;
}

function showToast({ tone, title, description }: ToastInput): string {
  const id = createToastId();
  dispatch({ type: "ADD_TOAST", toast: { id, tone, title, description } });

  // Radix removes the node when its own timer closes it; keep the store in sync.
  window.setTimeout(() => dispatch({ type: "DISMISS_TOAST", toastId: id }), 5000);
  return id;
}

export function toast(input: ToastInput): string {
  if (typeof window === "undefined") return "";
  return showToast(input);
}
