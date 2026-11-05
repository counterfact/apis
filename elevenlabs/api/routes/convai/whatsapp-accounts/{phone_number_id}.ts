import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/whatsapp-accounts"]["/{phone_number_id}"];
export const GET: Route["GET"] = async ($) => {
 try{return $.response.status(200).json($.context.get($.path.phone_number_id));}
 catch(error){if(error instanceof Error && error.name==="CommunicationError"){const e=error as Error & {status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.code}});}throw error;}
};
export const PATCH: Route["PATCH"] = async ($) => {
 try{return $.response.status(200).json($.context.update($.path.phone_number_id,$.body));}
 catch(error){if(error instanceof Error && error.name==="CommunicationError"){const e=error as Error & {status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.code}});}throw error;}
};
export const DELETE: Route["DELETE"] = async ($) => {
 try{return $.response.status(200).json($.context.remove($.path.phone_number_id));}
 catch(error){if(error instanceof Error && error.name==="CommunicationError"){const e=error as Error & {status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.code}});}throw error;}
};
