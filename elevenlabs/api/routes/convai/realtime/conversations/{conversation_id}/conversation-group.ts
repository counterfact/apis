import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/convai"]["/realtime"]["/conversations"]["/{conversation_id}"]["/conversation-group"];
export const PUT: Route["PUT"] = async ($) => {
  try { return $.response.status(200).json($.context.setGroup($.path.conversation_id, $.body)); }
  catch (error) {
    if (error instanceof Error && error.name === "RealtimeGroupError") {
      const failure = error as Error & {status:number; code:string};
      return $.x.response.status(failure.status).json({detail:{status:failure.code,message:failure.message}});
    }
    throw error;
  }
};
export const DELETE: Route["DELETE"] = async ($) => {
  try { return $.response.status(200).json($.context.clearGroup($.path.conversation_id)); }
  catch (error) {
    if (error instanceof Error && error.name === "RealtimeGroupError") {
      const failure = error as Error & {status:number; code:string};
      return $.x.response.status(failure.status).json({detail:{status:failure.code,message:failure.message}});
    }
    throw error;
  }
};
