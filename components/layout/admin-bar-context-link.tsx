"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Pencil } from "lucide-react";

import { adminBarApi } from "@/lib/api/endpoints";
import type { AdminBarEdit } from "@/types/api";

interface AdminBarContextLinkProps {
  initialPathname: string;
  initialEdit: AdminBarEdit | null;
}

export function AdminBarContextLink({ initialPathname, initialEdit }: AdminBarContextLinkProps) {
  const pathname = usePathname();
  const [context, setContext] = useState<{ pathname: string; edit: AdminBarEdit | null }>({
    pathname: initialPathname,
    edit: initialEdit,
  });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (pathname === context.pathname) return;

    startTransition(async () => {
      try {
        const { context } = await adminBarApi.editContext(pathname);
        setContext({ pathname, edit: context });
      } catch {
        setContext({ pathname, edit: null });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (isPending || !context.edit || context.pathname !== pathname) return null;

  return (
    <Link
      href={context.edit.href}
      className="inline-flex min-h-7 items-center gap-1.5 rounded-md px-2 py-1 font-bold text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 motion-reduce:transition-none"
    >
      <Pencil className="size-3.5 shrink-0" aria-hidden="true" />
      {context.edit.label}
    </Link>
  );
}
