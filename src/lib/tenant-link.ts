const TENANT_BASE_DOMAIN = process.env.TENANT_BASE_DOMAIN ?? "seudominio.com";
const TENANT_URL_MODE = (process.env.TENANT_URL_MODE ?? "subdomain") as "subdomain" | "path";
const TENANT_BASE_URL = process.env.TENANT_BASE_URL ?? "https://app.seudominio.com";

/**
 * Monta a URL de acesso do tenant.
 * - subdomain: https://{slug}.TENANT_BASE_DOMAIN
 * - path: TENANT_BASE_URL/b/{slug}
 */
export function getTenantUrl(slug: string): string {
  if (TENANT_URL_MODE === "path") {
    const base = TENANT_BASE_URL.replace(/\/$/, "");
    return `${base}/b/${slug}`;
  }
  const protocol = process.env.NODE_ENV === "production" ? "https" : "https";
  return `${protocol}://${slug}.${TENANT_BASE_DOMAIN}`;
}

export { TENANT_URL_MODE, TENANT_BASE_DOMAIN, TENANT_BASE_URL };
