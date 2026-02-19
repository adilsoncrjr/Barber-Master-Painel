-- AlterTable barbershops: add AI credits and update plan default
ALTER TABLE "barbershops" ADD COLUMN IF NOT EXISTS "ai_credits_total" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "barbershops" ADD COLUMN IF NOT EXISTS "ai_credits_balance" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "barbershops" ADD COLUMN IF NOT EXISTS "ai_credits_reset_at" TIMESTAMP(3);
ALTER TABLE "barbershops" ALTER COLUMN "plan" SET DEFAULT 'basico';
