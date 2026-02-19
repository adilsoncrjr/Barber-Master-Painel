/** Valores de plano no banco. */
export const PLAN_VALUES = ["basico", "pro", "master"] as const;
export type PlanValue = (typeof PLAN_VALUES)[number];

/** Rótulos exibidos no painel. */
export const PLAN_LABELS: Record<PlanValue, string> = {
  basico: "Plano Básico",
  pro: "Plano Pro",
  master: "Plano Master",
};

export const PLAN_OPTIONS: { value: PlanValue; label: string }[] = PLAN_VALUES.map((value) => ({
  value,
  label: PLAN_LABELS[value],
}));

export function getPlanLabel(plan: string): string {
  return PLAN_LABELS[plan as PlanValue] ?? plan;
}

/** Créditos de IA e data de reset conforme o plano. */
export function getCreditsForPlan(plan: PlanValue): {
  aiCreditsTotal: number;
  aiCreditsBalance: number;
  aiCreditsResetAt: Date;
} {
  const resetAt = new Date();
  resetAt.setDate(resetAt.getDate() + 30);
  switch (plan) {
    case "basico":
      return { aiCreditsTotal: 0, aiCreditsBalance: 0, aiCreditsResetAt: resetAt };
    case "pro":
      return { aiCreditsTotal: 200, aiCreditsBalance: 200, aiCreditsResetAt: resetAt };
    case "master":
      return { aiCreditsTotal: 600, aiCreditsBalance: 600, aiCreditsResetAt: resetAt };
    default:
      return { aiCreditsTotal: 0, aiCreditsBalance: 0, aiCreditsResetAt: resetAt };
  }
}
