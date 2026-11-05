import type { Routes } from "../../../../types/index.js";
type Route = Routes["/workspace"]["/resources"]["/{resource_id}"]["/unshare"];
export const POST: Route["POST"] = async ($) => {
  try {
    return $.response
      .status(200)
      .json($.context.shareResource($.path.resource_id, $.body, true));
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !["WorkspaceMemberError", "WorkspaceRequestError"].includes(error.name)
    )
      throw error;
    const e = error as Error & { status: number; code: string };
    return $.x.response
      .status(e.status)
      .json({ detail: { status: e.code, message: e.message } });
  }
};
