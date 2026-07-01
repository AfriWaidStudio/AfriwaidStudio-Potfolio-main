import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProjectsPage from "./ProjectsPage";

describe("ProjectsPage", () => {
  it("renders project workspace data from the API", async () => {
    localStorage.setItem("afriwaid_auth_token", "test-token");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);
      if (url === "/api/projects") {
        return new Response(JSON.stringify({
          projects: [{
            id: "proj-1",
            name: "WaidPulse AI Integrations",
            category: "AI Middleware",
            projectStatus: "In Development",
            clientProgPercent: 65,
            completionDate: "2026-07-05"
          }]
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      if (url === "/api/projects/proj-1/workspace") {
        return new Response(JSON.stringify({
          project: { id: "proj-1", name: "WaidPulse AI Integrations", completionDate: "2026-07-05" },
          milestones: [{ id: "m-1", title: "Discovery" }],
          tasks: [{ id: "t-1", title: "Configure Gemini tool specs", desc: "Build constraints", status: "active" }],
          files: [{ id: "f-1", name: "Requirements.pdf" }],
          deliverables: [],
          activities: [{ id: "a-1", title: "Project Initiated", details: "Workspace created", timestamp: "2026-06-01" }],
          invoices: []
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      return new Response("{}", { status: 404 });
    });

    render(
      <MemoryRouter>
        <ProjectsPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/projects", expect.any(Object)));
    expect(await screen.findAllByText("WaidPulse AI Integrations")).toHaveLength(2);
    expect(screen.getByText("Configure Gemini tool specs")).toBeInTheDocument();
    expect(screen.getByText("Project Initiated")).toBeInTheDocument();
  });
});
