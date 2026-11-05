import type { Routes } from "../../types/index.js";
type Route = Routes["/music"]["/finetunes"];
export const GET: Route["GET"] = async ($) => {
  const c = $.context;
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
  try { return $.response.status(201).json($.context.create($.body)); }
  catch (error) {
    if (error instanceof Error && ["FinetuneError", "MusicError"].includes(error.name)) {
      const e = error as Error & { status: number; code: string };
      return $.x.response.status(e.status).json({ detail: { status: e.code, message: e.message } });
    }
    throw error;
  }
};
