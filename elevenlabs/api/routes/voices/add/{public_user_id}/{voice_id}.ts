import type { Routes } from "../../../../types/index.js";
type Route = Routes["/voices"]["/add"]["/{public_user_id}"]["/{voice_id}"];
export const POST: Route["POST"] = async ($) => {
  try { return $.response.status(200).json($.context.importSharedVoice($.path.public_user_id, $.path.voice_id, $.body)); }
  catch (error) {
    if (error instanceof Error && error.name === "VoiceTransferError") {
      const e = error as Error & {status: number; code: string};
      return $.x.response.status(e.status).json({detail: {status: e.code, message: e.code}});
    }
    throw error;
  }
};
