import type { Routes } from "../../../../types/index.js";
type Route = Routes["/convai"]["/agents"]["/{agent_id}"]["/avatar"];
export const POST: Route["POST"] = async ($) => {
  try {
    return $.response
      .status(200)
      .json(
        $.context.uploadAvatar(
          $.path.agent_id,
          ($.body as unknown as Record<string, unknown>).avatar_file,
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
