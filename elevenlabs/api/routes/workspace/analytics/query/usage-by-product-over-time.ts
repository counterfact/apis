import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/workspace"]["/analytics"]["/query"]["/usage-by-product-over-time"];
export const POST: Route["POST"] = async ($) => {
  const result = $.context.queryUsage($.body);
  if (result.error !== undefined) {
    return $.x.response.status(400).json({
      detail: { status: "invalid_request", message: result.error },
    });
  }
  return $.response.status(200).json(result.value);
};
