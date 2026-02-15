const TENANT_URL_MODE = "path";

/**
 * URL base real do seu app (Render)
 */
const TENANT_BASE_URL = "https://barber-master-hub.onrender.com";

/**
 * Monta a URL de acesso do tenant.
 * Sempre modo path:
 * https://barber-master-hub.onrender.com/b/{slug}
 */
export function getTenantUrl(slug: string): string {
  const base = TENANT_BASE_URL.replace(/\/$/, "");
  return `${base}/b/${slug}`;
}

export { TENANT_URL_MODE, TENANT_BASE_URL };