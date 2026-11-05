import type { Routes } from "../../../../../../../../types/index.js";
type Route =
  Routes["/convai"]["/agents"]["/{agent_id}"]["/branches"]["/{branch_id}"]["/procedures"]["/{procedure_id}"]["/draft"];
export const GET: Route["GET"] = async ($) => {
  try {
    return $.response
      .status(200)
      .json(
        $.context.draft($.path.agent_id, $.path.branch_id, $.path.procedure_id),
      );
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "ProcedureError" || error.name === "LifecycleError")
    ) {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.code } });
    }
    throw error;
  }
};
export const PATCH: Route["PATCH"] = async ($) => {
  try {
    return $.response
      .status(200)
      .json(
        $.context.updateDraft(
          $.path.agent_id,
          $.path.branch_id,
          $.path.procedure_id,
          $.body,
        ),
      );
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "ProcedureError" || error.name === "LifecycleError")
    ) {
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
        $.context.deleteDraft(
          $.path.agent_id,
          $.path.branch_id,
          $.path.procedure_id,
        ),
      );
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "ProcedureError" || error.name === "LifecycleError")
    ) {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.code } });
    }
    throw error;
  }
};
