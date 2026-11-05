import type { Routes } from "../../../../types/index.js";
type Route = Routes["/convai"]["/agents"]["/{agent_id}"]["/drafts"];
export const POST: Route["POST"] = async ($) => {
  try {
    return $.response
      .status(200)
      .json(
        $.context.lifecycle!.saveDraft(
          $.path.agent_id,
          $.query.branch_id,
          $.body,
        ),
      );
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
export const DELETE: Route["DELETE"] = async ($) => {
  try {
    return $.response
      .status(200)
      .json(
        $.context.lifecycle!.deleteDraft($.path.agent_id, $.query.branch_id),
      );
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
