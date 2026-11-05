import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/conversations"]["/resolve"];
export const GET: Route["GET"] = async ($) => {
  try { return $.response.status(200).json($.context.resolveConversation($.query.agent_id, $.query.reference)); }
  catch (error) {
    if (error instanceof Error && error.name === "ConversationError") {
      const failure = error as Error & {status: number; code: string};
      return $.x.response.status(failure.status).json({detail: {status: failure.code, message: failure.message}});
    }
    throw error;
  }
};
