import type { Routes } from "../../../../types/index.js";
type Route = Routes["/flows"]["/templates"]["/{template_id}"]["/runs"];
export const POST: Route["POST"] = async ($) => {
  try {
    return $.response.status(200).json($.context.createRun($.path.template_id, $.body));
  } catch (error) {
    if (error instanceof Error && error.name === "TemplateError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response.status(e.status).json({ detail: { status: e.code, message: e.code } });
    }
    throw error;
  }
};
export const GET: Route["GET"] = async ($) => {
  try {
    return $.response
      .status(200)
      .json($.context.runs($.path.template_id, $.query));
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
