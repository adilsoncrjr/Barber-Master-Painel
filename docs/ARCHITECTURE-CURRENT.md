# Master Hub – Análise da arquitetura atual

## Onde está o CRUD de barbearias

| Função | Onde | Observação |
|--------|------|------------|
| **Listar** | `src/app/(dashboard)/barbershops/page.tsx` | Server Component; `prisma.barbershop.findMany()` com filtros `q`, `status`, `plan`. |
| **Lista (UI)** | `src/app/(dashboard)/barbershops/barbershops-table.tsx` | Tabela com nome, slug, status, plano, nº usuários, link "Ver". |
| **Filtros** | `src/app/(dashboard)/barbershops/barbershops-filters.tsx` | Filtro por nome (q), status (active/inactive), plano (trial/start/pro). |
| **Detalhe** | `src/app/(dashboard)/barbershops/[id]/page.tsx` | Server Component; `prisma.barbershop.findUnique()` + usuários admin. |
| **Ações no detalhe** | `src/app/(dashboard)/barbershops/[id]/barbershop-actions.tsx` | Ativar/Desativar (PATCH status), Copiar link do tenant. |
| **Criar (form)** | `src/app/(dashboard)/barbershops/new/new-barbershop-form.tsx` | Formulário que faz POST para `/api/barbershops`. |
| **Criar (API)** | `src/app/api/barbershops/route.ts` | **Proxy:** envia POST para backend externo (`API_BASE_URL/api/barbershops`). Não grava direto no Prisma. |
| **Alterar status** | `src/app/api/barbershops/[id]/status/route.ts` | PATCH; usa Prisma para alternar `active` ↔ `inactive`. |
| **Reset senha admin** | `src/app/api/barbershops/[id]/users/[userId]/reset-password/route.ts` | Existe rota para reset de senha do usuário. |

## Estrutura Supabase (Prisma)

- **super_admins** – login do painel Master (cuid, email, password_hash, created_at).
- **barbershops** – id (uuid), name, slug (unique), status (string), plan (string), created_at, updated_at.
- **users** – id, barbershop_id, role, name, phone, password_hash, is_active, created_at; unique (barbershop_id, phone).

Sem tabelas de billing, tickets ou audit_logs no schema atual.

## Rotas existentes

| Rota | Método | Descrição |
|------|--------|-----------|
| `/` | GET | Página inicial (redirect ou landing). |
| `/login` | GET | Página de login. |
| `/barbershops` | GET | Lista de barbearias (filtros). |
| `/barbershops/new` | GET | Formulário nova barbearia. |
| `/barbershops/[id]` | GET | Detalhe da barbearia + lista de admins. |
| `/api/barbershops` | POST | Proxy para criar barbearia no backend (API_BASE_URL). |
| `/api/barbershops/[id]/status` | PATCH | Alternar status active/inactive (Prisma). |
| `/api/barbershops/[id]/users/[userId]/reset-password` | POST | Reset de senha do admin. |
| `/api/auth/login` | POST | Pages Router – login. |
| `/api/auth/logout` | POST | Pages Router – logout. |

## Como o status funciona hoje

- **Valores no banco:** `status` é `String` com valores `"active"` ou `"inactive"`.
- **UI:** Badge “Ativo” (verde) ou “Inativo” (secundário).
- **Alteração:** Botão “Desativar” / “Ativar” na página do detalhe; chama `PATCH /api/barbershops/[id]/status`, que:
  - Lê a barbearia no Prisma.
  - Define `newStatus = status === "active" ? "inactive" : "active"`.
  - Atualiza com `prisma.barbershop.update({ data: { status: newStatus } })`.
- **Plano:** String com `trial` | `start` | `pro` (default `trial`). Só exibido; sem lógica de billing ainda.

## Fluxo de criação atual

1. Usuário preenche o form em `/barbershops/new` (nome, slug, status, plano, admin).
2. Front faz `POST /api/barbershops` com esses dados.
3. A rota do painel **não** usa Prisma para criar; faz proxy para `API_BASE_URL/api/barbershops` (ex.: app no Render).
4. O backend externo cria barbearia (e provavelmente usuário) no mesmo Supabase; o painel lê depois via Prisma.

## Tenant URL

- `src/lib/tenant-link.ts`: `getTenantUrl(slug)` retorna `https://barber-master-hub.onrender.com/b/{slug}` (modo path).
- Usado no detalhe para “Copiar link do tenant”.
