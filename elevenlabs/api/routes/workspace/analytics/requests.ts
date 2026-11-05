import type { Routes } from "../../../types/index.js";
type Route = Routes["/workspace"]["/analytics"]["/requests"];
export const POST: Route["POST"] = async ($) => {
  try {
    return $.response.status(200).json($.context.listRequests($.body));
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
