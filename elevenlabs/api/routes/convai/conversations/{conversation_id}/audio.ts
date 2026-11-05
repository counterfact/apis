import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/convai"]["/conversations"]["/{conversation_id}"]["/audio"];
export const GET: Route["GET"] = async ($) => {
  try { return $.response.status(200).match("audio/mpeg", Buffer.from($.context.getAudio($.path.conversation_id, $.x.query))); }
  catch (error) {
    if (error instanceof Error && error.name === "ConversationError") {
      const failure = error as Error & {status: number; code: string};
      return $.x.response.status(failure.status).json({detail: {status: failure.code, message: failure.message}});
    }
    throw error;
  }
};
