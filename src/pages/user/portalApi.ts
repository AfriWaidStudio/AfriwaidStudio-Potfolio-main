import { getPortalAuthHeaders } from "./auth";

export async function portalRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    ...getPortalAuthHeaders(),
    ...(options.body ? { "Content-Type": "application/json", "x-csrf-token": "afriwaid-csrf-v1" } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(endpoint, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed (${res.status})`);
  }
  return data;
}

export function formatDate(value?: string) {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

export function downloadTextFile(filename: string, content: string, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
