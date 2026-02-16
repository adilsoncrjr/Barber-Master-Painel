import * as React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: React.ReactNode;
  value: string | number;
  hint?: string;
  trend?: { value: string; positive: boolean };
}

export function StatCard({
  title,
  value,
  hint,
  trend,
  className,
  ...props
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 shadow-[var(--shadow-card)] transition-colors hover:shadow-[var(--shadow-md)]",
        className
      )}
      {...props}
    >
      <p className="text-muted-foreground text-sm font-medium">{title}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      {(hint || trend) && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          {hint && <span className="text-muted-foreground">{hint}</span>}
          {trend && (
            <span
              className={cn(
                "font-medium",
                trend.positive ? "text-emerald-600" : "text-red-600"
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
