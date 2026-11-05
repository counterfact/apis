import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/agents"]["/summaries"];
export const GET: Route["GET"] = async ($) => {
  const result = $.context.getSummaries(typeof $.query.agent_ids === "string" ? [$.query.agent_ids] : $.query.agent_ids);
  if (result.error) return $.x.response.status(400).json({ detail: { status: result.error, message: "Supply 1–100 nonblank agent IDs" } });
  return $.response.status(200).json(result.value);
};
