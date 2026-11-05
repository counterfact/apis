import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/realtime"]["/conversation-groups"];
export const GET: Route["GET"] = async ($) => {
  try { return $.response.status(200).json($.context.listGroups($.query)); }
  catch (error) {
    if (error instanceof Error && error.name === "RealtimeGroupError") {
      const failure = error as Error & {status:number; code:string};
      return $.x.response.status(failure.status).json({detail:{status:failure.code,message:failure.message}});
    }
    throw error;
  }
};
export const POST: Route["POST"] = async ($) => {
  try { return $.response.status(200).json($.context.createGroup($.body)); }
  catch (error) {
    if (error instanceof Error && error.name === "RealtimeGroupError") {
      const failure = error as Error & {status:number; code:string};
      return $.x.response.status(failure.status).json({detail:{status:failure.code,message:failure.message}});
    }
    throw error;
  }
};
