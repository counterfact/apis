import type { Routes } from "../../types/index.js";
import type { Context } from "./pvc/_.context.js";
type Route = Routes["/voices"]["/pvc"];
export const POST: Route["POST"] = async ($) => {
  try {
    return $.response
      .status(200)
      .json(($.context as unknown as Context).create($.body));
  } catch (error) {
    if (error instanceof Error && error.name === "PvcError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.code } });
    }
    throw error;
  }
};
