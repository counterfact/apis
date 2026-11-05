import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/convai"]["/conversations"]["/{conversation_id}"]["/analysis"]["/run"];
export const POST: Route["POST"] = async ($) => {
  try { return $.response.status(200).json($.context.runAnalysis($.path.conversation_id)); }
  catch(error){if(error instanceof Error&&error.name==="ConversationError"){const e=error as Error & {status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.message}});}throw error;}
};
