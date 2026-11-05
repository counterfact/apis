import type { Routes } from "../../../../types/index.js";
type Route=Routes["/convai"]["/knowledge-base"]["/{documentation_id}"]["/dependent-agents"];
export const GET:Route["GET"]=async($)=>{
  try { return $.response.status(200).json($.context.listDependentAgents([$.path.documentation_id],$.query)); }
  catch (error) {
    if (error instanceof Error && error.name === "KnowledgeBaseError") {
      const failure=error as Error & {status:number;code:string};
      return $.x.response.status(failure.status).json({detail:{status:failure.code,message:failure.message}});
    }
    throw error;
  }
};
