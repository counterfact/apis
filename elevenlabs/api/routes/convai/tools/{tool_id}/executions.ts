import type { Routes } from "../../../../types/index.js";
type Route = Routes["/convai"]["/tools"]["/{tool_id}"]["/executions"];
export const GET: Route["GET"] = async ($) => {
  const query = { ...$.query };
  // #2612: normalize only nullable numeric and boolean query fields.
  for (const key of ["start_time", "end_time"] as const) {
    if (typeof query[key] === "string" && /^(0|[1-9][0-9]*)$/.test(query[key])) query[key] = Number(query[key]);
  }
  if (typeof query.is_error === "string") {
    if (query.is_error === "true") query.is_error = true;
    else if (query.is_error === "false") query.is_error = false;
  }
  const result = $.context.listExecutions($.path.tool_id, query);
  if (result.error) return $.x.response.status(result.error === "tool_not_found" ? 404 : 400).json({ detail: { status: result.error } });
  return $.response.status(200).json(result.value);
};
