import type { Routes } from "../../../../../../../../types/index.js";
type Route =
  Routes["/voices"]["/pvc"]["/{voice_id}"]["/samples"]["/{sample_id}"]["/speakers"]["/{speaker_id}"]["/audio"];
export const GET: Route["GET"] = async ($) => {
  try { return $.response.status(200).json($.context.speakerAudio($.path.voice_id, $.path.sample_id, $.path.speaker_id));
  } catch(error) {
    if(error instanceof Error && error.name === "PvcError") {
      const e=error as Error & {status:number;code:string};
      return $.x.response.status(e.status).json({detail:{status:e.code,message:e.message}});
    }
    throw error;
  }
};
