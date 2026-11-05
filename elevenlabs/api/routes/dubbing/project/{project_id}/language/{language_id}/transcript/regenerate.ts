import type { Context } from "../../../../_.context.js";
import type { Routes } from "../../../../../../../types/index.js";
type Route =
  Routes["/dubbing"]["/project"]["/{project_id}"]["/language"]["/{language_id}"]["/transcript"]["/regenerate"];
export const POST: Route["POST"] = async ($) => {
  const c = $.context as unknown as Context;
  try { return $.x.response.status(202).json(c.regenerate($.path.project_id, $.path.language_id)); } catch(error) {
    if (error instanceof Error && error.name === "DubbingProjectError") {
      const e = error as Error & {status: number; code: string};
      return $.x.response.status(e.status).json({detail: {status: e.code, message: e.message}});
    }
    throw error;
  }
};
