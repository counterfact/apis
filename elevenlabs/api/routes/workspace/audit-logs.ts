import type { Routes } from "../../types/index.js";
type Route = Routes["/workspace"]["/audit-logs"];
export const GET: Route["GET"] = async ($) => {
  try {
    return $.response.status(200).json($.context.listAudit($.query));
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
