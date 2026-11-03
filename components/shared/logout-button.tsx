"use client";

import { useTransition, type ComponentPropsWithoutRef } from "react";
import { useRouter } from "next/navigation";

import { authApi } from "@/lib/api/endpoints";

type LogoutButtonProps = ComponentPropsWithoutRef<"button">;

export function LogoutButton({ className, children, disabled, ...rest }: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleLogout() {
    startTransition(async () => {
      try {
        await authApi.logout();
      } finally {
        router.replace("/login");
        router.refresh();
      }
    });
  }

  return (
    <button type="button" {...rest} disabled={disabled ?? isPending} className={className} onClick={handleLogout}>
      {children}
    </button>
  );
}
