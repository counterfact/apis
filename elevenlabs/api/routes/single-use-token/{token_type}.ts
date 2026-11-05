import type { Routes } from "../../types/index.js";
type Route = Routes["/single-use-token"]["/{token_type}"];
export const POST: Route["POST"] = async ($) => {
  try {return $.response.status(200).json($.context.issue($.path.token_type));}
  catch(error){if(error instanceof Error && ["CredentialError","LifecycleError"].includes(error.name)){const e=error as Error & {status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.code}});}throw error;}
};
