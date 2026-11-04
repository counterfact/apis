import type { Routes } from "../../../types/index.js";
type Route = Routes["/speech-to-text"]["/transcripts"]["/{transcription_id}"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
export const DELETE: Route["DELETE"] = async ($) => {
  return $.response.status(200).random();
};
