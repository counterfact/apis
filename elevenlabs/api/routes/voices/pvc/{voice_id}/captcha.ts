import type { Routes } from "../../../../types/index.js";
type Route = Routes["/voices"]["/pvc"]["/{voice_id}"]["/captcha"];
export const GET: Route["GET"] = async ($) => {
  try { return $.x.response.status(200).match("text/plain", $.context.captcha($.path.voice_id));
  } catch(error) {
    if(error instanceof Error && error.name === "PvcError") {
      const e=error as Error & {status:number;code:string};
      return $.x.response.status(e.status).json({detail:{status:e.code,message:e.message}});
    }
    throw error;
  }
};

export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
