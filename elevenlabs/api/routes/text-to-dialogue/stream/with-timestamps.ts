import type {Routes} from "../../../types/index.js";
import type {Context} from "../../text-to-dialogue/_.context.js";
type Route=Routes["/text-to-dialogue"]["/stream"]["/with-timestamps"];
export const POST:Route["POST"]=async($)=>{
 try{
  const context=$.context as unknown as Context;
  const result=context.dialogue($.body,$.query);
  let response=$.x.response.header("request-id",result.requestId);if(result.historyId)response=response.header("history-item-id",result.historyId);
  return response.status(200).json(result.payload);
 }catch(error){if(error instanceof Error&&error.name==="RenderingError"){const e=error as Error&{status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.code}});}throw error;}
};
