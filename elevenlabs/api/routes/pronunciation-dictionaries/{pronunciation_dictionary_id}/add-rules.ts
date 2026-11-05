import type { Routes } from "../../../types/index.js";
type Route =
  Routes["/pronunciation-dictionaries"]["/{pronunciation_dictionary_id}"]["/add-rules"];
export const POST: Route["POST"] = async ($) => {
  const result = $.context.addRules($.path.pronunciation_dictionary_id, $.body.rules);
  if (result.missing) {
    return $.x.response.status(404).json({
      detail: { status: "pronunciation_dictionary_not_found", message: "Pronunciation dictionary not found" },
    });
  }
  if (result.error !== undefined) {
    return $.x.response.status(400).json({
      detail: { status: "invalid_request", message: result.error },
    });
  }
  return $.response.status(200).json(result.value);
};
