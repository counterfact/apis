import type { Context } from "./users/_.context.js";
import type { Routes } from "../../types/index.js";
type Route = Routes["/convai"]["/users"];
export const GET: Route["GET"] = async ($) => {
  try {
    return $.response.status(200).json(($.x.context as Context).list($.query));
  } catch (error) {
    if (error instanceof Error && error.name === "ConversationUserError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.message } });
    }
    throw error;
  }
};
