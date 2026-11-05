import type { Routes } from "../../../../types/index.js";
type Route = Routes["/convai"]["/agents"]["/{agent_id}"]["/hold-audio"];
export const POST: Route["POST"] = async ($) => {
  try {
    return $.response
      .status(200)
      .json(
        $.context.uploadHoldAudio(
          $.path.agent_id,
          ($.body as unknown as Record<string, unknown>).hold_audio_file,
        ),
      );
  } catch (error) {
    if (
      error instanceof Error &&
      ["MediaError", "ConversationError"].includes(error.name)
    ) {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.message } });
    }
    throw error;
  }
};
export const DELETE: Route["DELETE"] = async ($) => {
  const result = $.context.deleteHoldAudio($.path.agent_id);
  if (result.error)
    return $.x.response.status(404).json({
      detail: { status: result.error, message: "Agent not found" },
    });
  return $.response.status(200).json(result.value);
};
