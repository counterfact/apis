import type { Context } from "./tags/_.context.js";
import type { Routes } from "../../types/index.js";
type Route = Routes["/convai"]["/tags"];
export const GET: Route["GET"] = async ($) => {
  // The runtime resolves the child context; collection handler types use the parent.
  const result = ($.x.context as Context).listTags($.query);
  if (result.error) return $.x.response.status(400).json({ detail: { status: result.error, message: "Invalid tag pagination" } });
  return $.response.status(200).json(result.value);
};
export const POST: Route["POST"] = async ($) => {
  const result = ($.x.context as Context).createTag($.body);
  if (result.error) return $.x.response.status(400).json({ detail: { status: result.error, message: "Invalid tag" } });
  return $.response.status(200).json(result.value);
};
