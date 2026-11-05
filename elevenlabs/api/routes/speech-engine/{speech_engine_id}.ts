import type { Routes } from "../../types/index.js";
type Route = Routes["/speech-engine"]["/{speech_engine_id}"];
export const GET: Route["GET"] = async ($) => {
  try {
    return $.response.status(200).json($.context.get($.path.speech_engine_id));
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
export const PATCH: Route["PATCH"] = async ($) => {
  try {
    return $.response
      .status(200)
      .json($.context.patch($.path.speech_engine_id, $.body));
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
export const DELETE: Route["DELETE"] = async ($) => {
  try {
    $.context.delete($.path.speech_engine_id);
    return $.response.status(204).empty();
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
