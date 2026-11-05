import type { Routes } from "../types/index.js";
type Route = Routes["/sound-generation"];
export const POST: Route["POST"] = async ($) => {
  try {
    const result = ($.context).generate($.body, $.query);
    return $.x.response.header("request-id", result.requestId).header("character-cost", String(result.cost)).status(200).match("audio/mpeg", Buffer.from(result.audio));
  } catch (error) {
    if (error instanceof Error && error.name === "SoundError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response.status(e.status).json({ detail: { status: e.code, message: e.code } });
    }
    throw error;
  }
};
