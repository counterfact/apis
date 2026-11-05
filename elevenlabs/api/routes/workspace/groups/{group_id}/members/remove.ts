import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/workspace"]["/groups"]["/{group_id}"]["/members"]["/remove"];
export const POST: Route["POST"] = async ($) => {
  try { return $.response.status(200).json($.context.removeMember($.path.group_id, $.body)); }
  catch (error) {
    // Runtime loading can create another module instance; match the error name.
    if (!(error instanceof Error) || error.name !== "GroupError") throw error;
    const failure = error as Error & { status: number; code: string };
    return $.x.response.status(failure.status).json({ detail: { status: failure.code, message: failure.message } });
  }
};
