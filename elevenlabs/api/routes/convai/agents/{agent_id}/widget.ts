import type { Routes } from "../../../../types/index.js";
type Route = Routes["/convai"]["/agents"]["/{agent_id}"]["/widget"];
export const GET: Route["GET"] = async ($) => {
  const result = $.context.getWidget(
    $.path.agent_id,
    $.query.conversation_signature,
  );
  if (result.error)
    return $.x.response
      .status(result.error === "agent_not_found" ? 404 : 400)
      .json({
        detail: {
          status: result.error,
          message:
            result.error === "agent_not_found"
              ? "Agent not found"
              : "Conversation signatures are not simulated",
        },
      });
  return $.response.status(200).json(result.value);
};
