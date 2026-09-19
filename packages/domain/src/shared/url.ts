/**
 * Only http(s) URLs are accepted for application URLs and website fields.
 * We intentionally reject `javascript:`, `data:`, and other schemes that
 * could be used for XSS if these values are ever rendered as links.
 */
export function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export function assertHttpUrl(value: string, field: string): void {
  if (!isHttpUrl(value)) {
    throw new Error(`${field} must be a valid http(s) URL`);
  }
}