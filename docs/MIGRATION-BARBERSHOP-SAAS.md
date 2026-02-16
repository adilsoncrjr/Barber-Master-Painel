# Migration: novos campos da barbearia (SaaS)

Foram adicionados ao model `Barbershop` no Prisma:

- `lastBillingAt` (DateTime?, opcional) – última cobrança
- `totalBilled` (Decimal?, opcional) – total faturado
- `internalNotes` (String?, opcional) – observações internas
- `deletedAt` (DateTime?, opcional) – soft delete

Valores de **status** aceitos na aplicação: `active` | `inactive` | `suspended` | `cancelled`.

Valores de **plan** aceitos: `free` | `trial` | `basic` | `start` | `pro` | `enterprise`.

## Aplicar no banco

Com `DATABASE_URL` e `DIRECT_URL` configurados no `.env`:

```bash
npx prisma migrate dev --name add_barbershop_saas_fields
```

Ou aplicar manualmente no Supabase (SQL):

```sql
ALTER TABLE barbershops
  ADD COLUMN IF NOT EXISTS last_billing_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS total_billed DECIMAL(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS internal_notes TEXT,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
```

Depois rode `npx prisma generate`.
