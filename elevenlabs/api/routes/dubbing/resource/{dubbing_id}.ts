import type { Routes } from "../../../types/index.js";
type Route = Routes["/dubbing"]["/resource"]["/{dubbing_id}"];
export const GET: Route["GET"] = async ($) => {
  const c = $.context;
  try {
    return $.response.status(200).json(c.get($.path.dubbing_id));
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
