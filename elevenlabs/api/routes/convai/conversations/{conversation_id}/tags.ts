import type { Routes } from "../../../../types/index.js";
type Route = Routes["/convai"]["/conversations"]["/{conversation_id}"]["/tags"];
export const POST: Route["POST"] = async ($) => {
  try { $.context.assignTags($.path.conversation_id, $.body); return $.response.status(204).empty(); }
  catch (error) {
    if (error instanceof Error && error.name === "ConversationError") {
      const failure = error as Error & {status: number; code: string};
      return $.x.response.status(failure.status).json({detail: {status: failure.code, message: failure.message}});
    }
    throw error;
  }
};
