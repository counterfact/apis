import type { Routes } from "../../../../../../types/index.js";
type Route =
  Routes["/dubbing"]["/resource"]["/{dubbing_id}"]["/segment"]["/{segment_id}"]["/{language}"];
export const PATCH: Route["PATCH"] = async ($) => {
  const c = $.context;
  try {
    return $.response
      .status(200)
      .json(
        c.updateSegment(
          $.path.dubbing_id,
          $.path.segment_id,
          $.path.language,
          $.body,
        ),
      );
  } catch (error) {
    if (error instanceof Error && error.name === "DubbingResourceError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.message } });
    }
    throw error;
  }
};
