import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/dubbing"]["/{dubbing_id}"]["/transcript"]["/{language_code}"];
export const GET: Route["GET"] = async ($) => {
  const c = $.context;
  try {
    const value = c.transcript(
      $.path.dubbing_id,
      $.path.language_code,
      $.query.format_type,
    );
    if (value.transcript_format === "json")
      return $.x.response.status(200).json(value.json!);
    return $.x.response.status(200).text((value.srt ?? value.webvtt)!);
  } catch (error) {
    if (error instanceof Error && error.name === "LegacyDubbingError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.message } });
    }
    throw error;
  }
};
