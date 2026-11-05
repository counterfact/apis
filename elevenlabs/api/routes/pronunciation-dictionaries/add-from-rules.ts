import type { Routes } from "../../types/index.js";
type Route = Routes["/pronunciation-dictionaries"]["/add-from-rules"];
export const POST: Route["POST"] = async ($) => {
  const result = $.context.createDictionary($.body);
  if (result.error !== undefined) {
    return $.x.response.status(400).json({
      detail: { status: "invalid_request", message: result.error },
    });
  }
  return $.response.status(200).json(result.value);
};
