import type { Context } from "../../../../voices/pvc/_.context.js";
import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/voices"]["/{voice_id}"]["/samples"]["/{sample_id}"]["/audio"];
export const GET: Route["GET"] = async ($) => {
  try { return $.x.response.status(200).match("audio/mpeg", Buffer.from(($.context as unknown as {voiceSamples: Context}).voiceSamples.audio($.path.voice_id, $.path.sample_id)));
  } catch(error) {
    if(error instanceof Error && error.name === "PvcError") {
      const e=error as Error & {status:number;code:string};
      return $.x.response.status(e.status).json({detail:{status:e.code,message:e.message}});
    }
    throw error;
  }
};
