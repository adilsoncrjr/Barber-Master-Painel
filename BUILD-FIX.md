# Como resolver erros de build

## Erro EISDIR no Windows

Se aparecer:
```
Error: EISDIR: illegal operation on a directory, readlink '...\node_modules\next\dist\pages\_app.js'
```

**Causa:** bug conhecido do Next.js no Windows (arquivo tratado como pasta no `node_modules`).

**Solução (escolha uma):**

1. **Reinstalar dependências**  
   No PowerShell, na pasta do projeto:
   ```powershell
   Remove-Item -Recurse -Force node_modules
   Remove-Item -Recurse -Force .next
   npm install
   npx prisma generate
   npm run build
   ```

2. **Build na Vercel (recomendado)**  
   O erro EISDIR é comum no Windows. Na Vercel (Linux) o build costuma passar. Faça commit, push e use o deploy na Vercel.

3. **Pasta sem espaços**  
   Se o projeto estiver em uma pasta com espaços (ex.: `Barber Master Hub Painel`), copie para uma pasta sem espaços (ex.: `barber-hub-painel`) e rode o build lá.

4. **WSL (Windows Subsystem for Linux)**  
   Abra o projeto no WSL e rode `npm install`, `npx prisma generate` e `npm run build` no Linux.

## Erros de tipo (lucide-react)

Foi adicionado `src/types/global.d.ts` com declaração do módulo `lucide-react`.

## Erros do Prisma (User, Barbershop não exportados)

Se aparecer `Module '"@prisma/client"' has no exported member 'User'` (ou `Barbershop`), gere o client:

```bash
npx prisma generate
```

Depois rode o build de novo.

---
*Auth via Pages Router (/api/auth/login e logout). App Router auth removido para build na Vercel.*
