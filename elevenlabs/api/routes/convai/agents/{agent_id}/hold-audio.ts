import type { Routes } from "../../../../types/index.js";
type Route = Routes["/convai"]["/agents"]["/{agent_id}"]["/hold-audio"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
export const DELETE: Route["DELETE"] = async ($) => {
  const result = $.context.deleteHoldAudio($.path.agent_id);
  if (result.error)
    return $.x.response.status(404).json({
      detail: { status: result.error, message: "Agent not found" },
    });
  return $.response.status(200).json(result.value);
};
