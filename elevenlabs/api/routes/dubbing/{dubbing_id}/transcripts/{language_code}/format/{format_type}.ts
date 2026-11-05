import type { Routes } from "../../../../../../types/index.js";
type Route =
  Routes["/dubbing"]["/{dubbing_id}"]["/transcripts"]["/{language_code}"]["/format"]["/{format_type}"];
export const GET: Route["GET"] = async ($) => {
  const c = $.context;
  try {
    return $.response
      .status(200)
      .json(
        c.transcript(
          $.path.dubbing_id,
          $.path.language_code,
          $.path.format_type,
        ),
      );
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
