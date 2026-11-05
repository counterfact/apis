import type { Routes } from "../../../types/index.js";
type Route=Routes["/convai"]["/batch-calling"]["/{batch_id}"];
export const GET:Route["GET"]=async($)=>{
  try{return $.response.status(200).json($.context.getBatch($.path.batch_id));}
  catch(error){
    if(error instanceof Error&&error.name==="BatchError"){const e=error as Error&{status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.message}});}
    throw error;
  }
};
export const DELETE:Route["DELETE"]=async($)=>{
  try{$.context.deleteBatch($.path.batch_id); return $.response.status(204).empty();}
  catch(error){
    if(error instanceof Error&&error.name==="BatchError"){const e=error as Error&{status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.message}});}
    throw error;
  }
};
