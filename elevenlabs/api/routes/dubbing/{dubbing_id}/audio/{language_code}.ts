import type { Routes } from "../../../../types/index.js";
type Route = Routes["/dubbing"]["/{dubbing_id}"]["/audio"]["/{language_code}"];
export const GET: Route["GET"] = async ($) => {
  const c = $.context;
  try { return $.x.response.status(200).match("audio/mpeg", Buffer.from(c.getAudio($.path.dubbing_id, $.path.language_code))); } catch(error) {
    if (error instanceof Error && error.name === "LegacyDubbingError") {
      const e = error as Error & {status: number; code: string};
      return $.x.response.status(e.status).json({detail: {status: e.code, message: e.message}});
    }
    throw error;
  }
};
