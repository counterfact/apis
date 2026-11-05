import type { Context } from "./finetunes/_.context.js";
import type { Routes } from "../../types/index.js";
type Route = Routes["/music"]["/finetunes"];
export const GET: Route["GET"] = async ($) => {
  const c = $.context as unknown as Context;
  try {
    return $.response.status(200).json(c.list($.query));
  } catch (error) {
    if (error instanceof Error && error.name === "FinetuneError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.message } });
    }
    throw error;
  }
};
export const POST: Route["POST"] = async ($) => {
  return $.response.status(201).random();
};
