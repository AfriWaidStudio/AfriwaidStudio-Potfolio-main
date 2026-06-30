const API_BASE = "";

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("afriwaid_auth_token") || sessionStorage.getItem("afriwaid_auth_token") || "";
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: this.getAuthHeaders(),
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", body: JSON.stringify(data) });
  }

  put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: "PUT", body: JSON.stringify(data) });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiService = new ApiService();
