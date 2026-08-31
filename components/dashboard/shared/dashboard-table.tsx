import type { ComponentProps, ReactNode } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const HEADER_CELL_CLASS = "h-10 px-4 text-start text-[12px] font-bold tracking-wide text-muted-foreground";

interface DashboardTableProps {
  headers: ReactNode[];
  minWidth?: string;
  children: ReactNode;
}

export function DashboardTable({ headers, minWidth = "min-w-[640px]", children }: DashboardTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table className={minWidth}>
        <TableHeader className="bg-muted/30">
          <TableRow className="border-b border-border/60 hover:bg-transparent">
            {headers.map((header, index) => (
              <TableHead key={index} className={HEADER_CELL_CLASS}>
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
      className={cn("border-b border-border/40 last:border-0 hover:bg-muted/30 motion-reduce:transition-none", className)}
      {...props}
    />
  );
}

export function DashboardTableCell({ className, ...props }: ComponentProps<typeof TableCell>) {
  return <TableCell className={cn("px-4 py-3.5", className)} {...props} />;
}
