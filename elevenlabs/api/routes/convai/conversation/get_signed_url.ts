import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/conversation"]["/get_signed_url"];
export const GET: Route["GET"] = async ($) => {
  try {return $.response.status(200).json($.context.signedUrl($.query));}
  catch(error){if(error instanceof Error && ["CredentialError","LifecycleError"].includes(error.name)){const e=error as Error & {status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.code}});}throw error;}
};
