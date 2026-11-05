import type {Routes} from "../../../types/index.js";
type Route=Routes["/text-to-voice"]["/{voice_id}"]["/remix"];
export const POST:Route["POST"]=async($)=>{
 try{return $.response.status(200).json($.context.remix($.path.voice_id,$.body,$.query));}
 catch(error){if(error instanceof Error&&error.name==="PreviewError"){const e=error as Error&{status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.code}});}throw error;}
};
