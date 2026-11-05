import type { Routes } from "../../../../../../types/index.js";
type Route =
  Routes["/dubbing"]["/project"]["/{project_id}"]["/transcript"]["/segment"]["/{segment_id}"];
export const PATCH: Route["PATCH"] = async ($) => {
  const c = $.context;
  try {
    const result = c.updateSource($.path.project_id, {
      [$.path.segment_id]: $.body,
    });
    return $.response
      .status(200)
      .json({ segment: result.segments[0], revision: result.revision });
  } catch (error) {
    if (error instanceof Error && error.name === "DubbingProjectError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.message } });
    }
    throw error;
  }
};
export const DELETE: Route["DELETE"] = async ($) => {
  const c = $.context;
  try {
    return $.response
      .status(200)
      .json(c.deleteSource($.path.project_id, $.path.segment_id));
  } catch (error) {
    if (error instanceof Error && error.name === "DubbingProjectError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.message } });
    }
    throw error;
  }
};
