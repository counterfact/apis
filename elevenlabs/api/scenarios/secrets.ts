import type { Scenario } from "../types/index.js";
export const emptySecrets: Scenario = ($) => {
  const context = $.loadContext("/convai/secrets");
  context.secrets = new Map();
  context.dependencies = new Map();
  context.nextSecretNumber = 0;
  context.referencedByEnvironmentVariable = id => [...$.loadContext("/convai/environment-variables").variables.values()].some(variable => variable.type === "secret" && Object.values(variable.values).some(value => typeof value === "object" && value !== null && "secret_id" in value && value.secret_id === id));
};
export const resetSecrets: Scenario = ($) => {
  emptySecrets($);
  const context = $.loadContext("/convai/secrets");
  context.secrets.set("sim-secret", { secret_id: "sim-secret", name: "Simulator service token", value: "synthetic-seed-value" });
  context.dependencies.set("sim-secret", { tools: [{ type: "unknown", id: "sim-tool-reference" }], agents: [], phone_numbers: [], others: [] });
};
