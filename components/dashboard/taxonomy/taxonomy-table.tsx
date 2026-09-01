import Image from "next/image";
import Link from "next/link";
import { CornerDownRight, Pencil } from "lucide-react";

import {
  DashboardTable,
  DashboardTableCell,
  DashboardTableRow,
} from "@/components/dashboard/shared/dashboard-table";
import { DeleteTaxonomyButton } from "@/components/dashboard/taxonomy/delete-taxonomy-button";
import { Button } from "@/components/ui/button";
import { TAXONOMY_LABELS } from "@/data/dashboard/ui";
import { buildCategoryTree, flattenCategoryTree } from "@/lib/blog/categories";
import { r2PublicUrl } from "@/lib/r2-url";
import { categoryHref, tagHref } from "@/lib/routes";
import { toFaDigits } from "@/lib/utils";

export interface CategoryTableRow {
  id: number;
  name: string;
  slug: string;
  path: string;
  parentId: number | null;
  image: string | null;
  _count: { posts: number };
}

export interface TagTableRow {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  _count: { posts: number };
}

type TaxonomyTableProps =
  | { kind: "category"; rows: CategoryTableRow[] }
  | { kind: "tag"; rows: TagTableRow[] };

export function TaxonomyTable({ kind, rows }: TaxonomyTableProps) {
  return kind === "category" ? <CategoryTable rows={rows} /> : <TagTable rows={rows} />;
}

function CategoryTable({ rows }: { rows: CategoryTableRow[] }) {
  const basePath = "/dashboard/categories";
  const flattened = flattenCategoryTree(buildCategoryTree(rows));

  return (
    <DashboardTable
      minWidth="min-w-[640px]"
      headers={[
        TAXONOMY_LABELS.nameLabel,
        TAXONOMY_LABELS.slugLabel,
        TAXONOMY_LABELS.kinds.category.postsSuffix,
        TAXONOMY_LABELS.actionLabel,
      ]}
    >
      {flattened.map(({ item: row, depth }) => {
        const url = categoryHref(row.path);

        return (
          <DashboardTableRow key={row.id}>
            <DashboardTableCell>
              <div
                className="flex items-center gap-2"
                style={depth > 0 ? { paddingInlineStart: `${depth * 20}px` } : undefined}
              >
                {depth > 0 ? (
                  <CornerDownRight className="size-4 shrink-0 text-muted-foreground/50" aria-hidden="true" />
                ) : null}
                <RowIdentity name={row.name} image={row.image} href={url} />
              </div>
            </DashboardTableCell>
            <DashboardTableCell dir="ltr" className="text-start text-[13px] font-medium text-muted-foreground">
              <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-mono ring-1 ring-border/60">
                {decodeURIComponent(url)}
              </span>
            </DashboardTableCell>
            <DashboardTableCell>
              <PostsCount count={row._count.posts} />
            </DashboardTableCell>
            <DashboardTableCell className="py-3">
              <RowActions basePath={basePath} id={row.id} kind="category" />
            </DashboardTableCell>
          </DashboardTableRow>
        );
      })}
    </DashboardTable>
  );
}

function TagTable({ rows }: { rows: TagTableRow[] }) {
  const basePath = "/dashboard/tags";

  return (
    <DashboardTable
      minWidth="min-w-[640px]"
      headers={[
        TAXONOMY_LABELS.nameLabel,
        TAXONOMY_LABELS.slugLabel,
        TAXONOMY_LABELS.kinds.tag.postsSuffix,
        TAXONOMY_LABELS.actionLabel,
      ]}
    >
      {rows.map((row) => {
        const url = tagHref(row.slug);

        return (
          <DashboardTableRow key={row.id}>
            <DashboardTableCell>
              <RowIdentity name={row.name} image={row.image} href={url} />
            </DashboardTableCell>
            <DashboardTableCell dir="ltr" className="text-start text-[13px] font-medium text-muted-foreground">
              <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-mono ring-1 ring-border/60">
                {decodeURIComponent(url)}
              </span>
            </DashboardTableCell>
            <DashboardTableCell>
              <PostsCount count={row._count.posts} />
            </DashboardTableCell>
            <DashboardTableCell className="py-3">
              <RowActions basePath={basePath} id={row.id} kind="tag" />
            </DashboardTableCell>
          </DashboardTableRow>
        );
      })}
    </DashboardTable>
  );
}

function RowIdentity({ name, image, href }: { name: string; image: string | null; href: string }) {
  return (
    <div className="flex items-center gap-3">
      {image ? (
        <Image
          src={r2PublicUrl(image)}
          alt=""
          aria-hidden="true"
          width={40}
          height={40}
          unoptimized
          className="size-10 shrink-0 rounded-lg object-cover ring-1 ring-border/60"
        />
      ) : (
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-[11px] font-black text-muted-foreground ring-1 ring-border/60"
          aria-hidden="true"
        >
          {name.trim().charAt(0) || "—"}
        </span>
      )}
      <Link
        href={href}
        target="_blank"
        className="rounded-sm text-[13px] font-bold leading-5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        {name}
      </Link>
    </div>
  );
}

function PostsCount({ count }: { count: number }) {
  return (
    <span className="inline-flex min-w-7 justify-center rounded-full bg-belt-blue/10 px-2 py-0.5 text-[12px] font-bold tabular-nums text-belt-blue ring-1 ring-belt-blue/15">
      {toFaDigits(count)}
    </span>
  );
}

function RowActions({ basePath, id, kind }: { basePath: string; id: number; kind: "category" | "tag" }) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        asChild
        aria-label="ویرایش"
        className="size-8 rounded-lg"
      >
        <Link href={`${basePath}/${id}/edit`}>
          <Pencil className="size-4" aria-hidden="true" />
        </Link>
      </Button>
      <DeleteTaxonomyButton kind={kind} id={id} />
    </div>
  );
}
