import type { Routes } from "../../types/index.js";
import type { Context } from "./tools/_.context.js";
type Route = Routes["/convai"]["/tools"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
export const GET: Route["GET"] = async ($) => {
  // #2608: runtime uses the nested collection context, unlike this generated type.
  const context = $.context as unknown as Context;
  const query = { ...$.query };
  // #2612: only this nullable integer stays text in the installed runtime.
  if (typeof query.page_size === "string" && /^(0|[1-9][0-9]*)$/.test(query.page_size)) query.page_size = Number(query.page_size);
  if (typeof query.types === "string") query.types = [query.types];
  const result = context.listTools(query);
  if (result.error) return $.x.response.status(400).json({ detail: { status: result.error } });
  return $.response.status(200).json(result.value);
};
