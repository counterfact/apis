import type { Routes } from "../../../../types/index.js";
type Route = Routes["/studio"]["/projects"]["/{project_id}"]["/content"];
export const POST: Route["POST"] = async ($) => {
  const c = $.context;
  try {
    return $.response
      .status(200)
      .json(
        c.blankContent(
          $.path.project_id,
          ($ as unknown as { body?: unknown }).body,
          ($.headers as Record<string, string>)["content-type"],
        ),
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
