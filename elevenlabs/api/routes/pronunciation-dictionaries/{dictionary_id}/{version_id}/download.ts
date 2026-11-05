import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/pronunciation-dictionaries"]["/{dictionary_id}"]["/{version_id}"]["/download"];
export const GET: Route["GET"] = async ($) => {
  const result = $.context.downloadDictionary($.path.dictionary_id, $.path.version_id);
  if (result.missing) return $.x.response.status(404).json({
    detail: {
      status: result.missing === "dictionary" ? "pronunciation_dictionary_not_found" : "pronunciation_dictionary_version_not_found",
      message: result.missing === "dictionary" ? "Pronunciation dictionary not found" : "Pronunciation dictionary version not found",
    },
  });
  if (result.error !== undefined) return $.x.response.status(400).json({
    detail: { status: "invalid_request", message: result.error },
  });
  return $.response.status(200)
    .header("Content-Disposition", 'attachment; filename="pronunciation-dictionary.pls"')
    .text(result.value);
};
