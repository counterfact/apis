import type {Routes} from "../../../types/index.js";
type Route=Routes["/text-to-voice"]["/{generated_voice_id}"]["/stream"];
export const GET:Route["GET"]=async($)=>{
 try{return $.response.status(200).match("audio/mpeg",Buffer.from($.context.audio($.path.generated_voice_id)));}
 catch(error){if(error instanceof Error&&error.name==="PreviewError"){const e=error as Error&{status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.code}});}throw error;}
};
