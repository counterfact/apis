import type { Routes } from "../../../types/index.js";
type Route = Routes["/speech-engine"]["/{speech_engine_id}"]["/duplicate"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(201).random();
};
