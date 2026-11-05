import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/convai"]["/agents"]["/{agent_id}"]["/knowledge-base"]["/rag-query"];
export const POST: Route["POST"] = async ($) => {
  try { return $.response.status(200).json($.context.queryKnowledgeBase($.path.agent_id,$.body,$.query.branch_id)); }
  catch(error) {
    if(error instanceof Error && ["KnowledgeBaseError","LifecycleError"].includes(error.name)) {
      const e=error as Error & {status:number;code:string};
      return $.x.response.status(e.status).json({detail:{status:e.code,message:e.message}});
    }
    throw error;
  }
};
