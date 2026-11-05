import type { Context } from "../../../voices/pvc/_.context.js";
import type { Routes } from "../../../../types/index.js";
type Route = Routes["/voices"]["/{voice_id}"]["/samples"]["/{sample_id}"];
export const DELETE: Route["DELETE"] = async ($) => {
  try { return $.response.status(200).json(($.context as unknown as {voiceSamples: Context}).voiceSamples.deleteSample($.path.voice_id, $.path.sample_id));
  } catch(error) {
    if(error instanceof Error && error.name === "PvcError") {
      const e=error as Error & {status:number;code:string};
      return $.x.response.status(e.status).json({detail:{status:e.code,message:e.message}});
    }
    throw error;
  }
};
