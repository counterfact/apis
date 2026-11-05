import type { Context } from "./auth-connections/_.context.js";
import type { Routes } from "../../types/index.js";
type Route = Routes["/workspace"]["/auth-connections"];
export const POST: Route["POST"] = async ($) => {
  const context = $.x.context as Context;
  try { return $.response.status(200).json(context.createAuthConnection($.body)); }
  catch (error) {
    // Runtime module loading may create separate copies of the Context module.
    if (!(error instanceof Error) || error.name !== "AuthConnectionError") throw error;
    return $.x.response.status(400).json({ detail: { status: "invalid_auth_connection", message: error.message } });
  }
};
export const GET: Route["GET"] = async ($) => {
  // Collection handlers use the parent's generated context type; runtime uses the child.
  const context = $.x.context as Context;
  return $.response.status(200).json(context.listAuthConnections());
};
