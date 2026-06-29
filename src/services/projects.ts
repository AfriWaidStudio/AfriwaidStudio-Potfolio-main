import { apiService } from "./api";
import { Project } from "../types";

export const projectsService = {
  getAll: (): Promise<Project[]> => apiService.get("/api/projects"),

  getById: (id: string): Promise<Project> => apiService.get(`/api/projects/${id}`),

  create: (data: Omit<Project, "id">): Promise<Project> =>
    apiService.post("/api/projects", data),

  update: (id: string, data: Partial<Project>): Promise<Project> =>
    apiService.put(`/api/projects/${id}`, data),

  delete: (id: string): Promise<void> => apiService.delete(`/api/projects/${id}`),

  getWorkspace: (id: string): Promise<Project> =>
    apiService.get(`/api/projects/${id}/workspace`),
};