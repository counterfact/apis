import type { Routes } from "../../../../types/index.js";
type Route=Routes["/convai"]["/knowledge-base"]["/{documentation_id}"]["/rag-index"];
export const POST:Route["POST"]=async($)=>{
  try{return $.response.status(200).json($.context.computeIndex($.path.documentation_id,$.body));}
  catch(error){if(error instanceof Error&&error.name==="KnowledgeBaseError"){const e=error as Error&{status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.message}});}throw error;}
};
export const GET:Route["GET"]=async($)=>{
  try{return $.response.status(200).json($.context.listIndexes($.path.documentation_id));}
  catch(error){if(error instanceof Error&&error.name==="KnowledgeBaseError"){const e=error as Error&{status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.message}});}throw error;}
};
