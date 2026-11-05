import type { Routes } from "../../../types/index.js";
type Route =
  Routes["/pronunciation-dictionaries"]["/{pronunciation_dictionary_id}"]["/remove-rules"];
export const POST: Route["POST"] = async ($) => {
  const result = $.context.removeRules($.path.pronunciation_dictionary_id, $.body.rule_strings);
  if (result.missing) {
    return $.x.response.status(404).json({
      detail: { status: "pronunciation_dictionary_not_found", message: "Pronunciation dictionary not found" },
    });
  }
  return $.response.status(200).json(result.value!);
};
