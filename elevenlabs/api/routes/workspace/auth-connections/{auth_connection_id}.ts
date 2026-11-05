import type { Routes } from "../../../types/index.js";
type Route = Routes["/workspace"]["/auth-connections"]["/{auth_connection_id}"];
export const PATCH: Route["PATCH"] = async ($) => {
  try {
    const result = $.context.updateAuthConnection($.path.auth_connection_id, $.body);
    if (!result) return $.x.response.status(404).json({ detail: { status: "auth_connection_not_found", message: "Auth connection not found" } });
    return $.response.status(200).json(result);
  } catch (error) {
    // Runtime module loading may create separate copies of the Context module.
    if (!(error instanceof Error) || error.name !== "AuthConnectionError") throw error;
    return $.x.response.status(400).json({ detail: { status: "invalid_auth_connection", message: error.message } });
  }
};
export const DELETE: Route["DELETE"] = async ($) => {
  const result = $.context.deleteAuthConnection($.path.auth_connection_id);
  if (!result) return $.x.response.status(404).json({ detail: { status: "auth_connection_not_found", message: "Auth connection not found" } });
  return $.response.status(200).json(result);
};
