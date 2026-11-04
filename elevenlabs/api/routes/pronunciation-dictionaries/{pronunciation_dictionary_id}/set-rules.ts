import type { Routes } from "../../../types/index.js";
type Route =
  Routes["/pronunciation-dictionaries"]["/{pronunciation_dictionary_id}"]["/set-rules"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
