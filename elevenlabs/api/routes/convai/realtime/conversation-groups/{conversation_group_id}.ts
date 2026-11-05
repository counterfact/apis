import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/convai"]["/realtime"]["/conversation-groups"]["/{conversation_group_id}"];
export const GET: Route["GET"] = async ($) => {
  try { return $.response.status(200).json($.context.getGroup($.path.conversation_group_id)); }
  catch (error) {
    if (error instanceof Error && error.name === "RealtimeGroupError") {
      const failure = error as Error & {status:number; code:string};
      return $.x.response.status(failure.status).json({detail:{status:failure.code,message:failure.message}});
    }
    throw error;
  }
};
export const PATCH: Route["PATCH"] = async ($) => {
  try { return $.response.status(200).json($.context.updateGroup($.path.conversation_group_id, $.body)); }
  catch (error) {
    if (error instanceof Error && error.name === "RealtimeGroupError") {
      const failure = error as Error & {status:number; code:string};
      return $.x.response.status(failure.status).json({detail:{status:failure.code,message:failure.message}});
    }
    throw error;
  }
};
export const DELETE: Route["DELETE"] = async ($) => {
  try { return $.response.status(200).json($.context.deleteGroup($.path.conversation_group_id)); }
  catch (error) {
    if (error instanceof Error && error.name === "RealtimeGroupError") {
      const failure = error as Error & {status:number; code:string};
      return $.x.response.status(failure.status).json({detail:{status:failure.code,message:failure.message}});
    }
    throw error;
  }
};
