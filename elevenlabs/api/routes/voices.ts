import type { Routes } from "../types/index.js";
type Route = Routes["/voices"];
export const GET: Route["GET"] = async ($) => {
  if ($.minVersion("v2")) {
    const result = $.context.listVoicesV2($.query);
    if (result.error !== undefined) {
      return $.x.response.status(400).json({
        detail: { status: "invalid_request", message: result.error },
      });
    }
    return $.response.status(200).json(result.page);
  }
  return $.response.status(200).json({ voices: $.context.listVoices() });
};
