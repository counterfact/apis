import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/convai"]["/agents"]["/{agent_id}"]["/merge-proposals"]["/{merge_proposal_id}"];
export const GET: Route["GET"] = async ($) => {
  try {
    return $.response
      .status(200)
      .json($.context.get($.path.agent_id, $.path.merge_proposal_id));
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "ProposalError" || error.name === "LifecycleError")
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
        $.context.update($.path.agent_id, $.path.merge_proposal_id, $.body),
      );
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "ProposalError" || error.name === "LifecycleError")
    ) {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.code } });
    }
    throw error;
  }
};
