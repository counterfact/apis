import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/twilio"]["/register-call"];
export const POST: Route["POST"] = async ($) => {
 try{return $.response.status(200).html($.context.register($.body));}
 catch(error){if(error instanceof Error && ["CommunicationError","LifecycleError"].includes(error.name)){const e=error as Error & {status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.code}});}throw error;}
};
