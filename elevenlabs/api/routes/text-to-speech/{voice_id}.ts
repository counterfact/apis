import type {Routes} from "../../types/index.js";
type Route=Routes["/text-to-speech"]["/{voice_id}"];
export const POST:Route["POST"]=async($)=>{
 try{
  const result=$.context.speech($.path.voice_id,$.body,$.query);
  let response=$.x.response.header("request-id",result.requestId);if(result.historyId)response=response.header("history-item-id",result.historyId);
  return response.status(200).match("audio/mpeg",Buffer.from(result.audio));
 }catch(error){if(error instanceof Error&&error.name==="RenderingError"){const e=error as Error&{status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.code}});}throw error;}
};
