import type { Routes } from "../../../../types/index.js";
type Route = Routes["/convai"]["/agents"]["/{agent_id}"]["/topics"];
export const GET: Route["GET"] = async ($) => {
  const result = $.context.getTopics($.path.agent_id, $.query);
  if (result.error)
    return $.x.response
      .status(result.error === "agent_not_found" ? 404 : 400)
      .json({ detail: { status: result.error, message: result.error } });
  return $.response.status(200).json(result.value);
};
