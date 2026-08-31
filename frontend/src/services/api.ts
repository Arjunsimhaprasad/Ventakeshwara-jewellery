// Centralized API client service for Venkateshwara Jewellery platform

export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

/**
 * Standard fetch wrapper that automatically prefixes API_BASE_URL if configured,
 * ensuring seamless connectivity across local Vite dev proxy and production deployments.
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = API_BASE_URL ? `${API_BASE_URL}${cleanEndpoint}` : cleanEndpoint;

  return fetch(url, options);
}
