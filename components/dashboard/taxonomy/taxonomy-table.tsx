import Image from "next/image";
import Link from "next/link";
import { CornerDownRight, Pencil } from "lucide-react";

import { DeleteTaxonomyButton } from "@/components/dashboard/taxonomy/delete-taxonomy-button";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    <TaxonomyTableShell postsSuffix={TAXONOMY_LABELS.kinds.category.postsSuffix}>
      {flattened.map(({ item: row, depth }) => (
        <TableRow
          key={row.id}
          className="border-b border-border/40 last:border-0 hover:bg-muted/30 motion-reduce:transition-none"
        >
          <TableCell className="px-4 py-3.5">
            <div
              className="flex items-center gap-2"
              style={depth > 0 ? { paddingInlineStart: `${depth * 20}px` } : undefined}
            >
              {depth > 0 ? (
                <CornerDownRight className="size-4 shrink-0 text-muted-foreground/50" aria-hidden="true" />
              ) : null}
              <RowIdentity name={row.name} image={row.image} href={categoryHref(row.path)} />
            </div>
          </TableCell>
          <TableCell
            dir="ltr"
            className="px-4 py-3.5 text-start text-[13px] font-medium text-muted-foreground"
          >
            <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-mono ring-1 ring-border/60">
              {categoryHref(row.path)}
            </span>
          </TableCell>
          <TableCell className="px-4 py-3.5">
            <PostsCount count={row._count.posts} />
          </TableCell>
          <TableCell className="px-4 py-3">
            <RowActions basePath={basePath} id={row.id} kind="category" />
          </TableCell>
        </TableRow>
      ))}
    </TaxonomyTableShell>
  );
}

function TagTable({ rows }: { rows: TagTableRow[] }) {
  const basePath = "/dashboard/tags";

  return (
    <TaxonomyTableShell postsSuffix={TAXONOMY_LABELS.kinds.tag.postsSuffix}>
      {rows.map((row) => (
        <TableRow
          key={row.id}
          className="border-b border-border/40 last:border-0 hover:bg-muted/30 motion-reduce:transition-none"
        >
          <TableCell className="px-4 py-3.5">
            <RowIdentity name={row.name} image={row.image} href={tagHref(row.slug)} />
          </TableCell>
          <TableCell
            dir="ltr"
            className="px-4 py-3.5 text-start text-[13px] font-medium text-muted-foreground"
          >
            <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-mono ring-1 ring-border/60">
              {tagHref(row.slug)}
            </span>
          </TableCell>
          <TableCell className="px-4 py-3.5">
            <PostsCount count={row._count.posts} />
          </TableCell>
          <TableCell className="px-4 py-3">
            <RowActions basePath={basePath} id={row.id} kind="tag" />
          </TableCell>
        </TableRow>
      ))}
    </TaxonomyTableShell>
  );
}

function TaxonomyTableShell({
  postsSuffix,
  children,
}: {
  postsSuffix: string;
  children: React.ReactNode;
}) {
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
                {postsSuffix}
              </TableHead>
              <TableHead className="h-10 px-4 text-start text-[12px] font-bold tracking-wide text-muted-foreground">
                عملیات
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{children}</TableBody>
        </Table>
      </div>
    </div>
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
        className="text-[13px] font-bold leading-5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 rounded-sm"
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
