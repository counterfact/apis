import type {Routes} from "../types/index.js";
import type {Context} from "./text-to-dialogue/_.context.js";
type Route=Routes["/text-to-dialogue"];
export const POST:Route["POST"]=async($)=>{
 try{
  const context=$.context;
  const result=context.dialogue($.body,$.query);
  let response=$.x.response.header("request-id",result.requestId);if(result.historyId)response=response.header("history-item-id",result.historyId);
  return response.status(200).match("audio/mpeg",Buffer.from(result.audio));
 }catch(error){if(error instanceof Error&&error.name==="RenderingError"){const e=error as Error&{status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.code}});}throw error;}
};
