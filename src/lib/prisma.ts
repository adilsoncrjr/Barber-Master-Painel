import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Bloqueia uso do Prisma durante o build do Next (evita "Failed to collect page data").
 */
function assertRuntimeAllowed(): void {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    throw new Error("Prisma: blocked during Next production build phase");
  }
}

function createPrisma(): PrismaClient {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? (["query", "error", "warn"] as const)
        : ["error"],
  });
}

export function getPrisma(): PrismaClient {
  assertRuntimeAllowed();
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const client = createPrisma();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
}

/**
 * Acesso lazy: PrismaClient só é criado na primeira propriedade acessada.
 * Durante o build, qualquer acesso chama assertRuntimeAllowed() e falha.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    assertRuntimeAllowed();
    const client = getPrisma() as unknown as Record<string | symbol, unknown>;
    return client[prop];
  },
});
