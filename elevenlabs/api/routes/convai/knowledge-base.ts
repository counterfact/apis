import type { Routes } from "../../types/index.js";
type Route = Routes["/convai"]["/knowledge-base"];
export const POST:Route["POST"]=async($)=>{
  try { return $.response.status(200).json($.context.createLegacy($.body,$.query.agent_id)); }
  catch(error){if(error instanceof Error && error.name === "KnowledgeBaseError"){const failure=error as Error & {status:number;code:string};return $.x.response.status(failure.status).json({detail:{status:failure.code,message:failure.message}});}throw error;}
};
export const GET:Route["GET"]=async($)=>{
  try { return $.response.status(200).json($.context.listDocuments($.query)); }
  catch (error) {
    if (error instanceof Error && error.name === "KnowledgeBaseError") {
      const failure=error as Error & {status:number;code:string};
      return $.x.response.status(failure.status).json({detail:{status:failure.code,message:failure.message}});
    }
    throw error;
  }
};
