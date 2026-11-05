import type { Routes } from "../../../types/index.js";
type Route = Routes["/speech-to-text"]["/transcripts"]["/{transcription_id}"];
export const GET: Route["GET"] = async ($) => {
  try {
    return $.response.status(200).json($.context.get($.path.transcription_id));
  } catch (error) {
    if (error instanceof Error && error.name === "TranscriptError")
      return $.x.response
        .status(404)
        .json({
          detail: { status: "transcript_not_found", message: error.message },
        });
    throw error;
  }
};
export const DELETE: Route["DELETE"] = async ($) => {
  try {
    return $.response
      .status(200)
      .json($.context.delete($.path.transcription_id));
  } catch (error) {
    if (error instanceof Error && error.name === "TranscriptError")
      return $.x.response
        .status(404)
        .json({
          detail: { status: "transcript_not_found", message: error.message },
        });
    throw error;
  }
};
