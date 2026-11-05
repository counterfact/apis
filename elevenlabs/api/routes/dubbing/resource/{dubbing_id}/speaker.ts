import type { Context } from "../_.context.js";
import type { Routes } from "../../../../types/index.js";
type Route = Routes["/dubbing"]["/resource"]["/{dubbing_id}"]["/speaker"];
export const POST: Route["POST"] = async ($) => {
  const c = $.context as unknown as Context;
  try {
    return $.response
      .status(200)
      .json(c.createSpeaker($.path.dubbing_id, $.body));
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
