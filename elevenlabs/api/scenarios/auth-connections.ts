import type { Scenario } from "../types/index.js";

export const emptyAuthConnections: Scenario = ($) => {
  const context = $.loadContext("/workspace/auth-connections");
  context.authConnections = new Map();
  context.nextAuthConnectionNumber = 0;
};

export const resetAuthConnections: Scenario = ($) => {
  emptyAuthConnections($);
  $.loadContext("/workspace/auth-connections").authConnections.set("sim-auth-connection", {
    id: "sim-auth-connection", name: "Simulator Basic Auth", auth_type: "basic_auth",
    provider: "example", username: "sim-user", password: "sim-password",
  });
};
