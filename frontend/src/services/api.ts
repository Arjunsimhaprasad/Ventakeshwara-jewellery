// Centralized API client service for Venkateshwara Jewellery platform

/**
 * Builds the full API URL by attaching VITE_API_URL if present,
 * avoiding duplicate '/api/api' path prefixes.
 */
export function buildApiUrl(endpoint: string): string {
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }

  const rawBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (!rawBase) {
    return cleanEndpoint;
  }

  // Avoid duplicate /api/api if rawBase ends with /api and cleanEndpoint starts with /api/
  if (rawBase.endsWith('/api') && cleanEndpoint.startsWith('/api/')) {
    return `${rawBase}${cleanEndpoint.substring(4)}`;
  }

  return `${rawBase}${cleanEndpoint}`;
}

export const API_BASE_URL = buildApiUrl('');

// Intercept global fetch if VITE_API_URL is configured, ensuring any fetch('/api/...') 
// automatically targets the deployed backend API URL across all pages and hooks without duplicate /api/api.
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    let targetUrl: string = '';

    if (typeof input === 'string') {
      targetUrl = input;
    } else if (input instanceof URL) {
      targetUrl = input.toString();
    } else if (input && typeof input === 'object' && 'url' in input) {
      targetUrl = (input as Request).url;
    }

    const rawBase = import.meta.env.VITE_API_URL || '';
    if (rawBase && targetUrl.startsWith('/api/')) {
      const fullUrl = buildApiUrl(targetUrl);
      if (typeof input === 'string') {
        input = fullUrl;
      } else if (input instanceof URL) {
        input = new URL(fullUrl);
      } else if (input && typeof input === 'object' && 'url' in input) {
        input = new Request(fullUrl, input as Request);
      }
    }

    return originalFetch.call(this, input, init);
  };
}

/**
 * Standard fetch wrapper that automatically prefixes VITE_API_URL if configured,
 * auto-attaches JWT authorization token if available in localStorage,
 * ensuring seamless connectivity across local dev and production deployments.
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const url = buildApiUrl(endpoint);

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {})
  };

  // Auto-attach JWT token if present in localStorage and not explicitly provided
  const token = localStorage.getItem('vj_token');
  if (token && !headers['Authorization'] && !headers['authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Auto-set Content-Type application/json if sending JSON string body
  if (options.body && typeof options.body === 'string' && !headers['Content-Type'] && !headers['content-type']) {
    try {
      JSON.parse(options.body);
      headers['Content-Type'] = 'application/json';
    } catch {
      // Not JSON string, leave content type unchanged
    }
  }

  return fetch(url, {
    ...options,
    headers
  });
}

