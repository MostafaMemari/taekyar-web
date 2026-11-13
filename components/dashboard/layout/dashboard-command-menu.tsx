"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DASHBOARD_LABELS } from "@/data/dashboard/ui";
import {
  DASHBOARD_NAV_ITEMS,
  DASHBOARD_QUICK_ACTIONS,
  type DashboardNavItem,
} from "@/data/dashboard/navigation";
import { cn } from "@/lib/utils";

export function DashboardCommandMenu() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey)) return;
      const target = event.target as HTMLElement | null;
      if (target?.isContentEditable) return;
      event.preventDefault();
      setOpen((previous) => !previous);
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          aria-label={DASHBOARD_LABELS.searchLabel}
          title={DASHBOARD_LABELS.searchLabel}
          className="h-10 gap-2 rounded-lg px-2.5 text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Search className="size-4 shrink-0" aria-hidden="true" />
          <span className="hidden xl:inline">{DASHBOARD_LABELS.searchPlaceholder}</span>
          <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground xl:inline">
            Ctrl K
          </kbd>
        </Button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          inputRef.current?.focus();
        }}
        className="theme-admin top-24 max-w-xl translate-y-0 gap-0 overflow-hidden p-0"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{DASHBOARD_LABELS.searchTitle}</DialogTitle>
          <DialogDescription>{DASHBOARD_LABELS.searchHint}</DialogDescription>
        </DialogHeader>

        <CommandSearch inputRef={inputRef} onNavigate={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function CommandSearch({
  inputRef,
  onNavigate,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  onNavigate: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const groups = useMemo(() => {
    const term = query.trim().toLowerCase();
    const matches = (item: DashboardNavItem) => (term ? item.label.toLowerCase().includes(term) : true);

    return [
      { label: DASHBOARD_LABELS.searchGroupPages, items: DASHBOARD_NAV_ITEMS.filter(matches) },
      { label: DASHBOARD_LABELS.searchGroupActions, items: DASHBOARD_QUICK_ACTIONS.filter(matches) },
    ].filter((group) => group.items.length > 0);
  }, [query]);

  const flatItems = useMemo(() => groups.flatMap((group) => group.items), [groups]);
  const indexOf = useMemo(() => new Map(flatItems.map((item, index) => [item.href, index])), [flatItems]);
  const activeItem = flatItems[activeIndex];

  function goTo(item: DashboardNavItem) {
    onNavigate();
    router.push(item.href);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (flatItems.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((previous) => (previous + 1) % flatItems.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((previous) => (previous - 1 + flatItems.length) % flatItems.length);
    } else if (event.key === "Enter" && activeItem) {
      event.preventDefault();
      goTo(activeItem);
    }
  }

  return (
    <>
      <div className="flex items-center gap-2.5 border-b border-border px-4">
        <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder={DASHBOARD_LABELS.searchPlaceholder}
          aria-label={DASHBOARD_LABELS.searchLabel}
          className="h-12 rounded-none border-0 bg-transparent px-0 text-sm focus-visible:ring-0"
        />
      </div>

      <div className="max-h-88 overflow-y-auto p-2">
        {flatItems.length === 0 ? (
          <p role="status" className="px-3 py-8 text-center text-[13px] text-muted-foreground">
            {DASHBOARD_LABELS.searchEmpty}
          </p>
        ) : (
          groups.map((group) => (
            <div key={group.label} className="pb-1">
              <p className="px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground">{group.label}</p>
              <ul>
                {group.items.map((item) => {
                  const itemIndex = indexOf.get(item.href) ?? 0;
                  const active = itemIndex === activeIndex;

                  return (
                    <li key={item.href}>
                      <button
                        type="button"
                        onClick={() => goTo(item)}
                        onMouseEnter={() => setActiveIndex(itemIndex)}
                        className={cn(
                          "flex min-h-10 w-full items-center gap-2.5 rounded-md px-2.5 text-start text-[13px] font-medium transition-colors motion-reduce:transition-none",
                          active ? "bg-muted text-foreground" : "text-foreground/80",
                        )}
                      >
                        <item.Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                        <span className="truncate">{item.label}</span>
                        {active ? (
                          <CornerDownLeft className="ms-auto size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </div>
    </>
  );
}
