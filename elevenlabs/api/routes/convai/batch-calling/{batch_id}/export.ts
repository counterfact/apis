import type { Routes } from "../../../../types/index.js";
type Route=Routes["/convai"]["/batch-calling"]["/{batch_id}"]["/export"];
export const GET:Route["GET"]=async($)=>{
  try{return $.response.status(200).match("text/csv",$.context.exportBatch($.path.batch_id,$.query.limit));}
  catch(error){
    if(error instanceof Error&&error.name==="BatchError"){const e=error as Error&{status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.message}});}
    throw error;
  }
};
