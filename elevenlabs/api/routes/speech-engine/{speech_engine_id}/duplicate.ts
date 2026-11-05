import type { Routes } from "../../../types/index.js";
type Route = Routes["/speech-engine"]["/{speech_engine_id}"]["/duplicate"];
export const POST: Route["POST"] = async ($) => {
  try {
    return $.response
      .status(201)
      .json($.context.duplicate($.path.speech_engine_id, $.body));
  } catch (error) {
    if (error instanceof Error && error.name === "SpeechEngineError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.message } });
    }
    throw error;
  }
};
