import type { Scenario } from "../types/index.js";
export const productionEnvironmentOnly: Scenario = ($) => {
  const context = $.loadContext("/convai/environments");
  context.environments = new Map([["production", { name: "production", updated_at_unix_secs: 1_735_689_600 }]]);
  context.nextEnvironmentNumber = 0;
  context.creationTimeUnix = 1_735_689_600;
  context.ownerUserId = "sim-user";
  context.variableStore = () => $.loadContext("/convai/environment-variables").variables;
  for (const variable of context.variableStore().values()) {
    for (const name of Object.keys(variable.values)) if (name !== "production") delete variable.values[name];
  }
};
export const resetEnvironments: Scenario = ($) => {
  productionEnvironmentOnly($);
  $.loadContext("/convai/environments").environments.set("staging", {
    name: "staging", created_by_user_id: "sim-user", updated_at_unix_secs: 1_735_689_600,
  });
};
