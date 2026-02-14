/**
 * Gera DATABASE_URL e DIRECT_URL com senha URL-encoded.
 * Use quando a senha tiver caracteres especiais: @ # % ! & = + etc.
 *
 * Defina no .env (DB_USER, DB_PASSWORD, DB_HOST, etc.) ou exporte antes de rodar.
 * Exemplo: node scripts/build-database-url.js
 * Copie a saída para DATABASE_URL e DIRECT_URL no .env (uma linha cada, sem quebras).
 */

const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (m) {
      const key = m[1];
      let val = m[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
        val = val.slice(1, -1).replace(/\\(.)/g, "$1");
      if (!process.env[key]) process.env[key] = val;
    }
  }
}
loadEnv();

const user = process.env.DB_USER || "";
const password = process.env.DB_PASSWORD || "";
const host = process.env.DB_HOST || "";
const port = process.env.DB_PORT || "5432";
const database = process.env.DB_NAME || "postgres";
const directHost = process.env.DIRECT_HOST || host;

if (!user || !password || !host) {
  console.error("Defina DB_USER, DB_PASSWORD e DB_HOST (e opcionalmente DIRECT_HOST, DB_PORT, DB_NAME).");
  process.exit(1);
}

// Escapa a senha para uso em URL (ex.: @ -> %40, # -> %23)
const encodedPassword = encodeURIComponent(password);

const base = (h) =>
  `postgresql://${user}:${encodedPassword}@${h}:${port}/${database}?sslmode=require`;

const databaseUrl = base(host);
const directUrl = base(directHost);

console.log("Cole no .env (uma linha por variável, sem quebras):\n");
console.log(`DATABASE_URL="${databaseUrl}"`);
console.log(`DIRECT_URL="${directUrl}"`);
