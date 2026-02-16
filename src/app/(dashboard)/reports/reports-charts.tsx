"use client";

type MonthlyData = {
  month: string;
  year: number;
  mrr: number;
  newBarbershops: number;
  cancelled: number;
};

export function ReportsCharts({ monthlyData }: { monthlyData: MonthlyData[] }) {
  if (monthlyData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
        <p>Nenhum dado disponível para os últimos 6 meses.</p>
      </div>
    );
  }

  const maxMrr = Math.max(
    ...monthlyData.map((d) => d.mrr),
    1
  );
  const maxNew = Math.max(
    ...monthlyData.map((d) => d.newBarbershops),
    1
  );
  const maxCancelled = Math.max(
    ...monthlyData.map((d) => d.cancelled),
    1
  );

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">
          MRR mensal (R$)
        </h3>
        <div className="flex h-32 items-end gap-2">
          {monthlyData.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-primary/80 transition-colors hover:bg-primary"
                style={{
                  height: `${Math.max((d.mrr / maxMrr) * 100, 2)}%`,
                }}
                title={`${d.month}/${d.year}: R$ ${d.mrr.toLocaleString("pt-BR")}`}
              />
              <span className="text-muted-foreground text-xs">
                {d.month}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">
          Novas barbearias
        </h3>
        <div className="flex h-32 items-end gap-2">
          {monthlyData.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-emerald-500/80 transition-colors hover:bg-emerald-500"
                style={{
                  height: `${Math.max((d.newBarbershops / maxNew) * 100, 2)}%`,
                }}
                title={`${d.month}/${d.year}: ${d.newBarbershops}`}
              />
              <span className="text-muted-foreground text-xs">
                {d.month}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">
          Cancelamentos
        </h3>
        <div className="flex h-32 items-end gap-2">
          {monthlyData.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-destructive/80 transition-colors hover:bg-destructive"
                style={{
                  height: `${Math.max((d.cancelled / maxCancelled) * 100, 2)}%`,
                }}
                title={`${d.month}/${d.year}: ${d.cancelled}`}
              />
              <span className="text-muted-foreground text-xs">
                {d.month}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
