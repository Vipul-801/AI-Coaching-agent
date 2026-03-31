import { NextResponse } from 'next/server';

/**
 * Middleware to normalize response headers for compatibility, security, and performance.
 * - Ensure responses include a UTF-8 charset when a content-type exists but no charset.
 * - Remove deprecated or insecure headers that audits flag (X-XSS-Protection, Pragma,
 *   Expires, X-Frame-Options).
 * - Set X-Content-Type-Options: nosniff
 * - For API routes replace `no-store` with `no-cache, must-revalidate` to avoid
 *   overly aggressive caching policies while still allowing revalidation.
 */
export function middleware(request) {
  const response = NextResponse.next();

  try {
    const headers = response.headers;

    // Ensure Content-Type includes charset utf-8 when present but missing charset
    const contentType = headers.get('content-type');
    if (contentType) {
      if (!/charset=/i.test(contentType)) {
        headers.set('content-type', `${contentType}; charset=utf-8`);
      }
    } else {
      // Default for HTML responses when Content-Type not set yet
      headers.set('content-type', 'text/html; charset=utf-8');
    }

    // Security / deprecated headers to remove
    headers.delete('x-xss-protection');
    headers.delete('pragma');
    headers.delete('expires');
    headers.delete('x-frame-options');

    // Add recommended headers
    headers.set('x-content-type-options', 'nosniff');

    // Improve cache-control for API routes (avoid `no-store` directive)
    const pathname = new URL(request.url).pathname;
    if (pathname.startsWith('/api/')) {
      // If no explicit Cache-Control or if it includes no-store, replace with safer default
      const cc = headers.get('cache-control') || '';
      if (!cc || /no-store/i.test(cc)) {
        headers.set('cache-control', 'no-cache, must-revalidate');
      }
    }
  } catch (err) {
    // Do not block the request if middleware fails; log for debugging in server console
    // Note: console.* in middleware will appear in terminal running Next dev.
    // Keep this lightweight to avoid noisy logs.
    // eslint-disable-next-line no-console
    console.warn('middleware header normalization failed', err);
  }

  return response;
}

export const config = {
  matcher: '/:path*',
};
