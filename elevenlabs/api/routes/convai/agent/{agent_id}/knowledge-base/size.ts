import type { Routes } from "../../../../../types/index.js";
type Route=Routes["/convai"]["/agent"]["/{agent_id}"]["/knowledge-base"]["/size"];
export const GET:Route["GET"]=async($)=>{
  try { return $.response.status(200).json($.context.agentKnowledgeSize($.path.agent_id)); }
  catch (error) {
    if (error instanceof Error && error.name === "KnowledgeBaseError") {
      const failure=error as Error & {status:number;code:string};
      return $.x.response.status(failure.status).json({detail:{status:failure.code,message:failure.message}});
    }
    throw error;
  }
};
