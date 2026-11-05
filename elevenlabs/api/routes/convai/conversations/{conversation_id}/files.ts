import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/convai"]["/conversations"]["/{conversation_id}"]["/files"];
export const POST: Route["POST"] = async ($) => {
  try {
    return $.response
      .status(200)
      .json(
        $.context.uploadFile(
          $.path.conversation_id,
          ($.body as unknown as Record<string, unknown>).file,
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
