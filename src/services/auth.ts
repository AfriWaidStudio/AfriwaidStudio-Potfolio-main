import { apiService } from "./api";
import { UserRole } from "../types";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  login: (credentials: { email: string; password: string }): Promise<AuthResponse> =>
    apiService.post("/api/auth/login", credentials),

  register: (data: { email: string; password: string; username: string }): Promise<AuthResponse> =>
    apiService.post("/api/auth/register", data),

  logout: (): Promise<void> => apiService.post("/api/auth/logout", {}),

  me: (): Promise<{ user: User }> => apiService.get("/api/auth/me"),

 forgotPassword: (email: string): Promise<void> =>
    apiService.post("/api/auth/forgot-password", { email }),

  resetPassword: (data: { token: string; password: string }): Promise<void> =>
    apiService.post("/api/auth/reset-password", data),
};
