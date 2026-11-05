import type { Routes } from "../../types/index.js";
type Route = Routes["/convai"]["/agents"];
export const GET: Route["GET"] = async ($) => {
  const result = $.context.listAgents($.query);
  if (result.error) return $.x.response.status(400).json({ detail: { status: result.error, message: "Invalid or unsupported agent query" } });
  return $.response.status(200).json(result.value);
};
