import type { Scenario } from "../types/index.js";
export const emptyEnvironmentVariables: Scenario = ($) => {
  const context = $.loadContext("/convai/environment-variables");
  context.variables = new Map();
  context.nextVariableNumber = 0;
  context.creationTimeUnix = 1_735_689_600;
  context.updateTimeUnix = 1_735_689_900;
  context.workspaceId = "sim-workspace";
  context.ownerUserId = "sim-user";
};
export const resetEnvironmentVariables: Scenario = ($) => {
  emptyEnvironmentVariables($);
  $.loadContext("/convai/environment-variables").variables.set("sim-environment-variable", {
    id: "sim-environment-variable", label: "Simulator endpoint", type: "string",
    workspace_id: "sim-workspace", created_by_user_id: "sim-user",
    created_at_unix_secs: 1_735_689_600, updated_at_unix_secs: 1_735_689_600,
    values: { production: "https://production.example.invalid", staging: "https://staging.example.invalid" },
  });
};
