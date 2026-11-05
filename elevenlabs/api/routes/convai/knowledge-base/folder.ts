import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/knowledge-base"]["/folder"];
export const POST:Route["POST"]=async($)=>{
  try { return $.response.status(200).json($.context.createFolder($.body)); }
  catch (error) {
    if (error instanceof Error && error.name === "KnowledgeBaseError") {
      const failure=error as Error & {status:number;code:string};
      return $.x.response.status(failure.status).json({detail:{status:failure.code,message:failure.message}});
    }
    throw error;
  }
};
