import type { Routes } from "../../../../../../types/index.js";
type Route =
  Routes["/studio"]["/projects"]["/{project_id}"]["/snapshots"]["/{project_snapshot_id}"]["/archive"];
export const POST: Route["POST"] = async ($) => {
  const c = $.context;
  try {
    return $.x.response
      .status(200)
      .match(
        "application/x-zip",
        Buffer.from(c.archive($.path.project_id, $.path.project_snapshot_id)),
      );
  } catch (error) {
    if (error instanceof Error && error.name === "StudioError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.message } });
    }
    throw error;
  }
};
