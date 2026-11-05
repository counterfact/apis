import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/dubbing"]["/project"]["/{project_id}"]["/transcript"]["/segment"];
export const POST: Route["POST"] = async ($) => {
  const c = $.context;
  try {
    return $.response.status(201).json(c.addSource($.path.project_id, $.body));
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
