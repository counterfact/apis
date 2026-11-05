import type { Context } from "./agents/_.context.js";
import type { Routes } from "../../types/index.js";
type Route = Routes["/convai"]["/agents"];
export const GET: Route["GET"] = async ($) => {
  // Installed runtime resolves the nested context at this collection boundary.
  const archived = $.query.archived as unknown;
  // Installed Dispatcher preserves text for nullable query schemas (upstream #2612).
  const result = ($.x.context as Context).listAgents({ ...$.query,
    tags: typeof $.query.tags === "string" ? [$.query.tags] : $.query.tags,
    archived: archived === "true" ? true : archived === "false" ? false : $.query.archived,
  });
  if (result.error) return $.x.response.status(400).json({ detail: { status: result.error, message: "Invalid or unsupported agent query" } });
  return $.response.status(200).json(result.value);
};
