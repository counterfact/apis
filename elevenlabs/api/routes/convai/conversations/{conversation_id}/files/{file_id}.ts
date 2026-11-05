import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/convai"]["/conversations"]["/{conversation_id}"]["/files"]["/{file_id}"];
export const DELETE: Route["DELETE"] = async ($) => {
  try { return $.response.status(200).json($.context.deleteFile($.path.conversation_id, $.path.file_id)); }
  catch (error) {
    if (error instanceof Error && error.name === "ConversationError") {
      const failure = error as Error & {status: number; code: string};
      return $.x.response.status(failure.status).json({detail: {status: failure.code, message: failure.message}});
    }
    throw error;
  }
};
