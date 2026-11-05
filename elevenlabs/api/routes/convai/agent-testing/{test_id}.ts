import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/agent-testing"]["/{test_id}"];
export const GET: Route["GET"] = async ($) => {
  const c = $.context;

  try {
    return $.response.status(200).json(c.get($.path.test_id));
  } catch (error) {
    if (error instanceof Error && error.name === "AgentTestError") {
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
    c.delete($.path.test_id);
    return $.response.status(200).json({});
  } catch (error) {
    if (error instanceof Error && error.name === "AgentTestError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.message } });
    }
    throw error;
  }
};
export const PUT: Route["PUT"] = async ($) => {
  return $.response.status(200).random();
};
