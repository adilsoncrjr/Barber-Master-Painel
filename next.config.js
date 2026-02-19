/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sem rewrite global de /api: as rotas do painel (barbershops, billing, etc.)
  // ficam em src/app/api/ e precisam ser atendidas pelo próprio Next.js.
  // O POST /api/barbershops já faz proxy para o backend em route.ts.
};

module.exports = nextConfig;