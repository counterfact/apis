import type { Routes } from "../../../../types/index.js";
type Route = Routes["/dubbing"]["/resource"]["/{dubbing_id}"]["/translate"];
export const POST: Route["POST"] = async ($) => {
  const c = $.context;
  try { return $.x.response.status(200).json(c.process($.path.dubbing_id, "translate", $.body)); } catch(error) {
    if (error instanceof Error && error.name === "DubbingResourceError") {
      const e = error as Error & {status: number; code: string};
      return $.x.response.status(e.status).json({detail: {status: e.code, message: e.message}});
    }
    throw error;
  }
};
