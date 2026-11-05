import type { Routes } from "../../../../../types/index.js";
type Route=Routes["/convai"]["/knowledge-base"]["/{documentation_id}"]["/rag-index"]["/{rag_index_id}"];
export const DELETE:Route["DELETE"]=async($)=>{
  try{return $.response.status(200).json($.context.deleteIndex($.path.documentation_id,$.path.rag_index_id));}
  catch(error){if(error instanceof Error&&error.name==="KnowledgeBaseError"){const e=error as Error&{status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.message}});}throw error;}
};
