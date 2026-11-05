import type { Context } from "../../_.context.js";
import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/dubbing"]["/project"]["/{project_id}"]["/language"]["/{language_id}"];
export const GET: Route["GET"] = async ($) => {
  const c = $.context as unknown as Context;
  try {
    return $.response
      .status(200)
      .json(c.language($.path.project_id, $.path.language_id));
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
  const c = $.context as unknown as Context;
  try {
    c.deleteLanguage($.path.project_id, $.path.language_id);
    return $.response.status(204).empty();
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
