import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/analytics"]["/live-count"];
export const GET: Route["GET"] = async ($) => {
  try { return $.response.status(200).json($.context.liveCount($.query)); }
  catch(error){if(error instanceof Error&&error.name==="ConversationError"){const e=error as Error & {status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.message}});}throw error;}
};
