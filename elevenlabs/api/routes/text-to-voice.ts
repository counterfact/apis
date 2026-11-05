import type {Routes} from "../types/index.js";
import type {Context} from "./text-to-voice/_.context.js";
type Route=Routes["/text-to-voice"];
export const POST:Route["POST"]=async($)=>{
 try{return $.response.status(200).json(($.context as unknown as Context).save($.body));}
 catch(error){if(error instanceof Error&&error.name==="PreviewError"){const e=error as Error&{status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.code}});}throw error;}
};
