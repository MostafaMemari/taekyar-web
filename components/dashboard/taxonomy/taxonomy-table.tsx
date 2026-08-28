import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";

import { DeleteTaxonomyButton } from "@/components/dashboard/taxonomy/delete-taxonomy-button";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TAXONOMY_LABELS } from "@/data/dashboard/ui";
import { r2PublicUrl } from "@/lib/r2-url";
import { toFaDigits } from "@/lib/utils";

interface TaxonomyRow {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  _count: { posts: number };
}

export function TaxonomyTable({ kind, rows }: { kind: "category" | "tag"; rows: TaxonomyRow[] }) {
  const basePath = `/dashboard/${kind === "category" ? "categories" : "tags"}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm shadow-black/[0.03]">
      <div className="overflow-x-auto">
        <Table className="min-w-[640px]">
          <TableHeader className="bg-muted/30">
            <TableRow className="border-b border-border/60 hover:bg-transparent">
              <TableHead className="h-10 px-4 text-start text-[12px] font-bold tracking-wide text-muted-foreground">
                {TAXONOMY_LABELS.nameLabel}
              </TableHead>
              <TableHead className="h-10 px-4 text-start text-[12px] font-bold tracking-wide text-muted-foreground">
                {TAXONOMY_LABELS.slugLabel}
              </TableHead>
              <TableHead className="h-10 px-4 text-start text-[12px] font-bold tracking-wide text-muted-foreground">
                {TAXONOMY_LABELS.kinds[kind].postsSuffix}
              </TableHead>
              <TableHead className="h-10 px-4 text-start text-[12px] font-bold tracking-wide text-muted-foreground">
                عملیات
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                className="border-b border-border/40 last:border-0 hover:bg-muted/30 motion-reduce:transition-none"
              >
                <TableCell className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    {row.image ? (
                      <Image
                        src={r2PublicUrl(row.image)}
                        alt=""
                        aria-hidden="true"
                        width={40}
                        height={40}
                        className="size-10 shrink-0 rounded-lg object-cover ring-1 ring-border/60"
                      />
                    ) : (
                      <span
                        className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-[11px] font-black text-muted-foreground ring-1 ring-border/60"
                        aria-hidden="true"
                      >
                        {row.name.trim().charAt(0) || "—"}
                      </span>
                    )}
                    <Link
                      href={`${basePath}/${row.id}/edit`}
                      className="text-[13px] font-bold leading-5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 rounded-sm"
                    >
                      {row.name}
                    </Link>
                  </div>
                </TableCell>
                <TableCell
                  dir="ltr"
                  className="px-4 py-3.5 text-start text-[13px] font-medium text-muted-foreground"
                >
                  <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-mono ring-1 ring-border/60">
                    /blog/{kind}/{row.slug}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3.5">
                  <span className="inline-flex min-w-7 justify-center rounded-full bg-belt-blue/10 px-2 py-0.5 text-[12px] font-bold tabular-nums text-belt-blue ring-1 ring-belt-blue/15">
                    {toFaDigits(row._count.posts)}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      asChild
                      aria-label="ویرایش"
                      className="size-8 rounded-lg"
                    >
                      <Link href={`${basePath}/${row.id}/edit`}>
                        <Pencil className="size-4" aria-hidden="true" />
                      </Link>
                    </Button>
                    <DeleteTaxonomyButton kind={kind} id={row.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
