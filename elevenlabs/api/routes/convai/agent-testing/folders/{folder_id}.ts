import type { Routes } from "../../../../types/index.js";
import type { Context } from "../_.context.js";
type Route = Routes["/convai"]["/agent-testing"]["/folders"]["/{folder_id}"];
export const GET: Route["GET"] = async ($) => {
  const c = $.context as unknown as Context;

  try {
    return $.response.status(200).json(c.folder($.path.folder_id));
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
export const PATCH: Route["PATCH"] = async ($) => {
  const c = $.context as unknown as Context;

  try {
    return $.response
      .status(200)
      .json(c.renameFolder($.path.folder_id, $.body));
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
  const c = $.context as unknown as Context;

  try {
    c.deleteFolder($.path.folder_id, $.query.force);
    return $.response.status(204).empty();
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
