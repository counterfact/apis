import type { Routes } from "../../types/index.js";
type Route = Routes["/workspace"]["/members"];
export const GET: Route["GET"] = async ($) => {
  try { return $.response.status(200).json($.context.listMembers()); }
  catch (error) {
    if (!(error instanceof Error) || error.name !== "WorkspaceMemberError") throw error;
    const failure = error as Error & {status:number; code:string};
    return $.x.response.status(failure.status).json({detail:{status:failure.code,message:failure.message}});
  }
};
export const POST: Route["POST"] = async ($) => {
  try { return $.response.status(200).json($.context.updateMember($.body)); }
  catch (error) {
    if (!(error instanceof Error) || error.name !== "WorkspaceMemberError") throw error;
    const failure = error as Error & {status:number; code:string};
    return $.x.response.status(failure.status).json({detail:{status:failure.code,message:failure.message}});
  }
};
