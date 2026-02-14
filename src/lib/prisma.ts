import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Evita que Prisma seja instanciado/consultado durante o build do Next/Vercel.
 * O erro "Failed to collect page data..." muitas vezes vem do Next tentando
 * executar algo de API/route no build; isso força a falha a ser clara e impede init.
 */
function assertRuntimeAllowed() {
  // Next define NEXT_PHASE durante build
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

  // Em dev, cache pra não abrir 999 conexões no HMR
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

/**
 * Acesso lazy: PrismaClient só é criado na primeira propriedade acessada.
 * Durante o build (NEXT_PHASE), qualquer acesso lança erro para evitar init.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    assertRuntimeAllowed();
    const client = getPrisma() as unknown as Record<string | symbol, unknown>;
    return client[prop];
  },
});