import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/studio"]["/projects"]["/{project_id}"]["/pronunciation-dictionaries"];
export const POST: Route["POST"] = async ($) => {
  const c = $.context;
  try {
    return $.response
      .status(200)
      .json(c.attachDictionaries($.path.project_id, $.body));
  } catch (error) {
    if (error instanceof Error && error.name === "StudioError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.message } });
    }
    throw error;
  }
};
