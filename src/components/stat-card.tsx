import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: React.ReactNode;   // ← alterado de title para heading
  value: string | number;
  hint?: string;
}

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

      <div className="mt-2 text-2xl font-bold tracking-tight">
        {value}
      </div>

      {hint && (
        <div className="mt-1 text-xs text-muted-foreground">
          {hint}
        </div>
      )}
    </div>
  );
}