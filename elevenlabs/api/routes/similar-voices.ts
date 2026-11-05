import type { Routes } from "../types/index.js";
type Route = Routes["/similar-voices"];
export const POST: Route["POST"] = async ($) => {
  try {
    return $.response.status(200).json($.context.similarUploadedVoices($.body));
  } catch (error) {
    if (error instanceof Error && error.name === "VoiceTransferError") {
      const e = error as Error & {status:number;code:string};
      return $.x.response.status(e.status).json({detail:{status:e.code,message:e.code}});
    }
    throw error;
  }
};
