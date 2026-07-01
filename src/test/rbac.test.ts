import { describe, expect, it } from "vitest";
import { OFFICIAL_ROLES } from "../types";

describe("official RBAC roles", () => {
  it("keeps the approved role registry in one typed list", () => {
    expect(OFFICIAL_ROLES).toEqual([
      "Super Admin",
      "Admin",
      "Moderator",
      "Developer",
      "Operator",
      "Auditor",
      "Team Member",
      "Client",
      "User",
    ]);
  });
});
