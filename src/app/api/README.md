# API (App Router)

As rotas `/api/auth/login` e `/api/auth/logout` **não** ficam aqui.

Elas são tratadas pelo **Pages Router** em `src/pages/api/auth/login.ts` e `logout.ts` para evitar o erro de build na Vercel ("Failed to collect page data for /api/auth/login").

Não crie `src/app/api/auth/login/route.ts` nem `src/app/api/auth/logout/route.ts`.
