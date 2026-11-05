import type { Routes } from "../../types/index.js";
type Route =
  Routes["/pronunciation-dictionaries"]["/{pronunciation_dictionary_id}"];
export const PATCH: Route["PATCH"] = async ($) => {
  const metadata = $.context.updateDictionary($.path.pronunciation_dictionary_id, $.body);
  if (!metadata) return $.x.response.status(404).json({
    detail: { status: "pronunciation_dictionary_not_found", message: "Pronunciation dictionary not found" },
  });
  return $.response.status(200).json(metadata);
};
export const GET: Route["GET"] = async ($) => {
  const dictionary = $.context.getDictionary($.path.pronunciation_dictionary_id);
  if (!dictionary) return $.x.response.status(404).json({
    detail: { status: "pronunciation_dictionary_not_found", message: "Pronunciation dictionary not found" },
  });
  return $.response.status(200).json(dictionary);
};
