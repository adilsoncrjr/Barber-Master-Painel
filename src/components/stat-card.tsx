import React from "react";
import { cn } from "@/lib/utils";

type StatCardProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  heading: React.ReactNode;
  value: string | number;
  hint?: React.ReactNode;
};

export function StatCard({
  heading,
  value,
  hint,
  className,
  ...props
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md",
        className
      )}
      {...props}
    >
      <div className="text-sm text-muted-foreground">{heading}</div>
      <div className="mt-2 text-2xl font-bold tracking-tight">{value}</div>
      {hint ? <div className="mt-1 text-xs text-muted-foreground">{hint}</div> : null}
    </div>
  );
}