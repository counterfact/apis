import type { Scenario } from "../types/index.js";

export const emptyGroups: Scenario = ($) => {
  const context = $.loadContext("/workspace/groups");
  context.groups = new Map();
  context.members = new Map();
};

export const resetGroups: Scenario = ($) => {
  emptyGroups($);
  const context = $.loadContext("/workspace/groups");
  context.members = new Map([
    ["narrator@example.invalid", "sim-member-narrator"],
    ["assistant@example.invalid", "sim-member-assistant"],
  ]);
  context.groups = new Map([
    ["sim-group-team", { id: "sim-group-team", name: "Simulator Team", members: ["sim-member-narrator"], permissions: [], is_scim_synced: false, scim_frozen: false }],
    ["sim-group-scim", { id: "sim-group-scim", name: "Simulator SCIM", members: [], permissions: [], is_scim_synced: true, scim_frozen: true }],
  ]);
};
