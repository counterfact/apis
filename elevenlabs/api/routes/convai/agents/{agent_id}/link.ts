import type { Routes } from "../../../../types/index.js";
type Route = Routes["/convai"]["/agents"]["/{agent_id}"]["/link"];
export const GET: Route["GET"] = async ($) => {
  const result = $.context.getLink($.path.agent_id);
  if (result.error)
    return $.x.response
      .status(404)
      .json({ detail: { status: result.error, message: "Agent not found" } });
  return $.response.status(200).json(result.value);
};
