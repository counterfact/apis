import type { Routes } from "../../../../types/index.js";
type Route = Routes["/dubbing"]["/resource"]["/{dubbing_id}"]["/language"];
export const POST: Route["POST"] = async ($) => {
  const c = $.context;
  try {
    return $.response
      .status(201)
      .json(c.addLanguage($.path.dubbing_id, $.body));
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
