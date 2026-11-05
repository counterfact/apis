import type { Routes } from "../types/index.js";
import type { Context } from "./shared-voices/_.context.js";
type Route = Routes["/shared-voices"];
const integer = (v: unknown) =>
  v == null
    ? undefined
    : typeof v === "number"
      ? v
      : typeof v === "string" && /^(0|[1-9]\d*)$/.test(v)
        ? Number(v)
        : NaN;
const boolean = (v: unknown) =>
  v == null
    ? undefined
    : v === true || v === "true"
      ? true
      : v === false || v === "false"
        ? false
        : v;
export const GET: Route["GET"] = async ($) => {
  try {
    const value = ($.x.context as Context).list({
      ...$.query,
      min_notice_period_days: integer($.query.min_notice_period_days),
      include_custom_rates: boolean($.query.include_custom_rates),
      include_live_moderated: boolean($.query.include_live_moderated),
    });
    return $.response.status(200).json(value);
  } catch (error) {
    if (error instanceof Error && error.name === "LibraryError")
      return $.x.response
        .status(400)
        .json({
          detail: {
            status: "invalid_voice_library_query",
            message: error.message,
          },
        });
    throw error;
  }
};
