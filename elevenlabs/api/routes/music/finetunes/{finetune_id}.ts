import type { Routes } from "../../../types/index.js";
type Route = Routes["/music"]["/finetunes"]["/{finetune_id}"];
export const GET: Route["GET"] = async ($) => {
  const c = $.context;
  try {
    return $.response.status(200).json(c.get($.path.finetune_id));
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
export const PATCH: Route["PATCH"] = async ($) => {
  const c = $.context;
  try {
    return $.response.status(200).json(c.update($.path.finetune_id, $.body));
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
export const DELETE: Route["DELETE"] = async ($) => {
  const c = $.context;
  try {
    return $.response.status(200).json(c.delete($.path.finetune_id));
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
