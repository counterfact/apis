import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/convai"]["/agents"]["/{agent_id}"]["/versions"]["/{version_id}"];
export const GET: Route["GET"] = async ($) => {
  try {
    return $.response
      .status(200)
      .json($.context.lifecycle!.version($.path.agent_id, $.path.version_id));
  } catch (error) {
    if (error instanceof Error && error.name === "LifecycleError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.code } });
    }
    throw error;
  }
};
