"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DataTableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isLoading?: boolean;
}

export function DataTableWrapper({
  children,
  isLoading,
  className,
  ...props
}: DataTableProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface DataTablePropsInternal extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export function DataTable({ children, className, ...props }: DataTablePropsInternal) {
  return (
    <div className="overflow-x-auto">
      <table
        className={cn("w-full text-sm", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function DataTableHeader({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "sticky top-0 z-10 border-b bg-muted/40 [&_tr]:border-b",
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

export function DataTableBody({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props}>{children}</tbody>;
}

export function DataTableRow({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-b transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function DataTableHead({
  children,
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function DataTableCell({
  children,
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    >
      {children}
    </td>
  );
}

export function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card p-4">
      <div className="space-y-4">
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <div
              key={i}
              className="h-4 flex-1 animate-pulse rounded bg-muted"
            />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, row) => (
          <div key={row} className="flex gap-4">
            {Array.from({ length: cols }).map((_, col) => (
              <div
                key={col}
                className="h-8 flex-1 animate-pulse rounded bg-muted/60"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
