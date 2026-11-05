import type { Context } from "../../_.context.js";
import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/dubbing"]["/resource"]["/{dubbing_id}"]["/render"]["/{language}"];
export const POST: Route["POST"] = async ($) => {
  const c = $.context as unknown as Context;
  try { return $.x.response.status(200).json(c.render($.path.dubbing_id, $.path.language, $.body)); } catch(error) {
    if (error instanceof Error && error.name === "DubbingResourceError") {
      const e = error as Error & {status: number; code: string};
      return $.x.response.status(e.status).json({detail: {status: e.code, message: e.message}});
    }
    throw error;
  }
};
