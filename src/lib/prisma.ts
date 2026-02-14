import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrisma(): PrismaClient {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? (["query", "error", "warn"] as const)
        : ["error"],
  });
}

export function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const client = createPrisma();
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}

/** Acesso lazy: PrismaClient só é criado na primeira propriedade acessada (evita init no build). */
export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop: string) {
    return (getPrisma() as Record<string, unknown>)[prop];
  },
});
