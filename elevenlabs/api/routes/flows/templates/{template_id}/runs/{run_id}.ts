import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/flows"]["/templates"]["/{template_id}"]["/runs"]["/{run_id}"];
export const GET: Route["GET"] = async ($) => {
  try {
    return $.response
      .status(200)
      .json($.context.run($.path.template_id, $.path.run_id));
  } catch (error) {
    if (error instanceof Error && error.name === "TemplateError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.code } });
    }
    throw error;
  }
};
