/**
 * URL do deploy do Hub App (app multi-tenant).
 * Usado em next.config.js para rewrites de /app/*.
 * Defina HUB_APP_ORIGIN no .env (ex.: https://seu-hub.vercel.app).
 */
export const HUB_APP_ORIGIN =
  process.env.HUB_APP_ORIGIN ||
  process.env.NEXT_PUBLIC_HUB_APP_ORIGIN ||
  "https://barber-master-hub.onrender.com";
