import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";

import { DeleteTaxonomyButton } from "@/components/dashboard/taxonomy/delete-taxonomy-button";
import { Button } from "@/components/ui/button";
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
    <div className="overflow-hidden rounded-2xl bg-card shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.05]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-black/[0.06] text-xs text-muted-foreground">
              <th scope="col" className="px-4 py-3 text-start font-bold">{TAXONOMY_LABELS.nameLabel}</th>
              <th scope="col" className="px-4 py-3 text-start font-bold">{TAXONOMY_LABELS.slugLabel}</th>
              <th scope="col" className="px-4 py-3 text-start font-bold">{TAXONOMY_LABELS.kinds[kind].postsSuffix}</th>
              <th scope="col" className="px-4 py-3 text-start font-bold">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-black/[0.04] transition-colors last:border-b-0 hover:bg-muted/40"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {row.image ? (
                      <Image
                        src={r2PublicUrl(row.image)}
                        alt=""
                        aria-hidden="true"
                        width={40}
                        height={40}
                        className="size-10 shrink-0 rounded-lg object-cover ring-1 ring-black/[0.06]"
                      />
                    ) : (
                      <span className="size-10 shrink-0 rounded-lg bg-muted" aria-hidden="true" />
                    )}
                    <Link href={`${basePath}/${row.id}/edit`} className="font-bold hover:text-primary">
                      {row.name}
                    </Link>
                  </div>
                </td>
                <td dir="ltr" className="px-4 py-3 text-start text-[13px] text-muted-foreground">
                  /blog/{kind}/{row.slug}
                </td>
                <td className="px-4 py-3 text-[13px] tabular-nums text-muted-foreground">
                  {toFaDigits(row._count.posts)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" asChild aria-label="ویرایش">
                      <Link href={`${basePath}/${row.id}/edit`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <DeleteTaxonomyButton kind={kind} id={row.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
