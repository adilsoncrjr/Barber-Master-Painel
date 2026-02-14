# Barber Hub Painel

Painel **Master** do SaaS de barbearias. Permite ao Super Admin cadastrar barbearias (tenants), criar o usuário ADMIN de cada uma e gerenciar status, plano e link de acesso. Usa o mesmo banco (Postgres) e as mesmas tabelas `Barbershop` e `User` que o app tenant (multi-tenant por `barbershopId`).

## Stack

- **Next.js** (App Router), **TypeScript**, **Prisma**, **PostgreSQL**
- **Tailwind CSS** + componentes no estilo **shadcn/ui**
- Autenticação Super Admin por sessão (cookie httpOnly) e tabela `SuperAdmin`

## Pré-requisitos

- Node.js 18+
- PostgreSQL

## Configuração

### 1. Variáveis de ambiente

Copie o exemplo e ajuste:

```bash
cp .env.example .env
```

Edite `.env`:

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | URL do Postgres (ex: `postgresql://user:password@localhost:5432/barber_hub`) |
| `SUPER_ADMIN_EMAIL` | E-mail do Super Admin (usado no seed) |
| `SUPER_ADMIN_PASSWORD` | Senha do Super Admin (usado no seed) |
| `TENANT_BASE_DOMAIN` | Domínio base do tenant no modo subdomínio (ex: `seudominio.com`) |
| `TENANT_URL_MODE` | `subdomain` ou `path` |
| `TENANT_BASE_URL` | Base URL do app tenant no modo path (ex: `https://app.seudominio.com`) |
| `SESSION_COOKIE_NAME` | Nome do cookie de sessão (opcional) |
| `SESSION_MAX_AGE` | Idade máxima da sessão em segundos (opcional, padrão 86400) |

### 2. Dependências

```bash
npm install
```

### 3. Banco de dados

Gerar o cliente Prisma e criar as tabelas:

```bash
npm run db:generate
npm run db:migrate
```

Ou, sem histórico de migrations (ex.: ambiente novo):

```bash
npm run db:push
```

### 4. Seed (Super Admin inicial)

Cria o primeiro Super Admin com os dados do `.env` (não recria se o e-mail já existir):

```bash
npm run seed
```

### 5. Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). A rota `/` redireciona para `/barbershops`. Faça login em `/login` com o e-mail e senha definidos no seed.

## Rotas do painel

| Rota | Descrição |
|------|-----------|
| `/login` | Login Super Admin |
| `/` | Redireciona para `/barbershops` |
| `/barbershops` | Lista de barbearias (busca e filtros por status/plano) |
| `/barbershops/new` | Criar barbearia + admin (dono) |
| `/barbershops/[id]` | Detalhe: dados, admins, ativar/desativar, resetar senha do admin, copiar link do tenant |

## Link do tenant

- **Modo subdomínio** (`TENANT_URL_MODE=subdomain`): `https://{slug}.{TENANT_BASE_DOMAIN}`
- **Modo path** (`TENANT_URL_MODE=path`): `{TENANT_BASE_URL}/b/{slug}`

O botão "Copiar link do tenant" na página da barbearia usa essa regra.

## Segurança

- Rotas exceto `/login` exigem sessão de Super Admin.
- Middleware (`src/middleware.ts`) redireciona não autenticados para `/login`.
- Cookie de sessão httpOnly; senhas com bcrypt.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção |
| `npm run db:generate` | Gera cliente Prisma |
| `npm run db:migrate` | Roda migrations |
| `npm run db:push` | Sincroniza schema com o banco (sem migration) |
| `npm run db:studio` | Abre Prisma Studio |
| `npm run seed` | Cria Super Admin inicial a partir do `.env` |

## Modelo de dados (resumo)

- **SuperAdmin**: id, email, passwordHash, createdAt (uso interno do painel).
- **Barbershop**: id (uuid), name, slug (unique), status (active/inactive), plan (trial/start/pro), createdAt, updatedAt.
- **User**: id (uuid), barbershopId, role (admin/barber/client), name, phone, passwordHash, isActive, createdAt; unique (barbershopId, phone). Compartilhado com o app tenant.

Este repositório contém apenas o **painel Master**. O app tenant (agenda, financeiro, etc.) não faz parte deste projeto.
