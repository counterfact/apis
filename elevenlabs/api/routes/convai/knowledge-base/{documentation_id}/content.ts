import type { Routes } from "../../../../types/index.js";
type Route = Routes["/convai"]["/knowledge-base"]["/{documentation_id}"]["/content"];
export const GET:Route["GET"]=async($)=>{
  try { return $.response.status(200).match("text/html",$.context.getContent($.path.documentation_id)); }
  catch (error) {
    if (error instanceof Error && error.name === "KnowledgeBaseError") {
      const failure=error as Error & {status:number;code:string};
      return $.x.response.status(failure.status).json({detail:{status:failure.code,message:failure.message}});
    }
    throw error;
  }
};
