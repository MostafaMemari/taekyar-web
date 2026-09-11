import type { ComponentProps, ReactNode } from "react";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const HEADER_CELL_CLASS = "h-11 px-4 text-start text-[12px] font-semibold text-muted-foreground";

const HIDDEN_COLUMN_CLASSES: Record<number, string> = {
  1: "[&_td:nth-child(1)]:hidden md:[&_td:nth-child(1)]:table-cell [&_th:nth-child(1)]:hidden md:[&_th:nth-child(1)]:table-cell",
  2: "[&_td:nth-child(2)]:hidden md:[&_td:nth-child(2)]:table-cell [&_th:nth-child(2)]:hidden md:[&_th:nth-child(2)]:table-cell",
  3: "[&_td:nth-child(3)]:hidden md:[&_td:nth-child(3)]:table-cell [&_th:nth-child(3)]:hidden md:[&_th:nth-child(3)]:table-cell",
  4: "[&_td:nth-child(4)]:hidden md:[&_td:nth-child(4)]:table-cell [&_th:nth-child(4)]:hidden md:[&_th:nth-child(4)]:table-cell",
  5: "[&_td:nth-child(5)]:hidden md:[&_td:nth-child(5)]:table-cell [&_th:nth-child(5)]:hidden md:[&_th:nth-child(5)]:table-cell",
  6: "[&_td:nth-child(6)]:hidden md:[&_td:nth-child(6)]:table-cell [&_th:nth-child(6)]:hidden md:[&_th:nth-child(6)]:table-cell",
};

interface DashboardTableProps {
  caption: string;
  headers: ReactNode[];
  children: ReactNode;
  minWidth?: string;
  hiddenOnMobile?: number[];
}

export function DashboardTable({
  caption,
  headers,
  children,
  minWidth = "min-w-[720px]",
  hiddenOnMobile = [],
}: DashboardTableProps) {
  return (
    <div
      className={cn(
        "overflow-x-auto",
        hiddenOnMobile.map((index) => HIDDEN_COLUMN_CLASSES[index] ?? "").join(" "),
      )}
    >
      <Table className={minWidth}>
        <TableCaption className="sr-only">{caption}</TableCaption>
        <TableHeader className="bg-muted/50">
          <TableRow className="border-b border-border hover:bg-transparent">
            {headers.map((header, index) => (
              <TableHead key={index} scope="col" className={HEADER_CELL_CLASS}>
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  );
}

export function DashboardTableRow({ className, ...props }: ComponentProps<typeof TableRow>) {
  return (
    <TableRow
      className={cn(
        "border-b border-border last:border-0 hover:bg-muted/40 motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

export function DashboardTableCell({ className, ...props }: ComponentProps<typeof TableCell>) {
  return <TableCell className={cn("px-4 py-3 align-middle", className)} {...props} />;
}
