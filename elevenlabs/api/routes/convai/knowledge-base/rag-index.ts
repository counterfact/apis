import type { Routes } from "../../../types/index.js";
type Route=Routes["/convai"]["/knowledge-base"]["/rag-index"];
export const POST:Route["POST"]=async($)=>{
  try{return $.response.status(200).json($.context.batchIndexes($.body));}
  catch(error){if(error instanceof Error&&error.name==="KnowledgeBaseError"){const e=error as Error&{status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.message}});}throw error;}
};
export const GET:Route["GET"]=async($)=>{
  try{return $.response.status(200).json($.context.ragOverview());}
  catch(error){if(error instanceof Error&&error.name==="KnowledgeBaseError"){const e=error as Error&{status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.message}});}throw error;}
};
