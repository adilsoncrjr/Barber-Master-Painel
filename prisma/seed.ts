import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Defina SUPER_ADMIN_EMAIL e SUPER_ADMIN_PASSWORD no .env para rodar o seed.");
  }

  const existing = await prisma.superAdmin.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

  if (existing) {
    console.log("Super Admin já existe:", existing.email);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.superAdmin.create({
    data: {
      email: email.trim().toLowerCase(),
      passwordHash,
    },
  });
  console.log("Super Admin criado:", email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
