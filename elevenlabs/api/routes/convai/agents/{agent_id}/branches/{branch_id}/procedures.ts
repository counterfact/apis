import type { Routes } from "../../../../../../types/index.js";
import type { Context } from "./procedures/_.context.js";
type Route =
  Routes["/convai"]["/agents"]["/{agent_id}"]["/branches"]["/{branch_id}"]["/procedures"];
export const POST: Route["POST"] = async ($) => {
  try {
    return $.response
      .status(200)
      .json(
        ($.context as unknown as Context).create(
          $.path.agent_id,
          $.path.branch_id,
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
export const GET: Route["GET"] = async ($) => {
  try {
    return $.response
      .status(200)
      .json(
        ($.context as unknown as Context).list(
          $.path.agent_id,
          $.path.branch_id,
          $.query.agent_version_id,
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
