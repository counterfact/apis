import type {Routes} from "../types/index.js";
import {SpeechInputError} from "./forced-alignment/_.context.js";
type Route=Routes["/forced-alignment"];
export const POST:Route["POST"]=async($)=>{
 try{return $.response.status(200).json($.context.align($.body));}
 catch(error){if(error instanceof Error&&error.name==="SpeechInputError"){const e=error as SpeechInputError;return $.x.response.status(e.status).json({detail:{status:e.code,message:e.message}});}throw error;}
};
