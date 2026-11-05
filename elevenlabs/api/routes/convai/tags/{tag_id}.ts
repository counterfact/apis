import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/tags"]["/{tag_id}"];
export const GET: Route["GET"] = async ($) => {
  const tag = $.context.getTag($.path.tag_id);
  if (!tag) return $.x.response.status(404).json({ detail: { status: "tag_not_found", message: "Tag not found" } });
  return $.response.status(200).json(tag);
};
export const PATCH: Route["PATCH"] = async ($) => {
  const result = $.context.updateTag($.path.tag_id, $.body);
  if (result.error) return $.x.response.status(result.error === "tag_not_found" ? 404 : 400).json({ detail: { status: result.error, message: result.error === "tag_not_found" ? "Tag not found" : "Invalid tag" } });
  return $.response.status(200).json(result.value);
};
export const DELETE: Route["DELETE"] = async ($) => {
  if (!$.context.deleteTag($.path.tag_id)) return $.x.response.status(404).json({ detail: { status: "tag_not_found", message: "Tag not found" } });
  return $.response.status(204).empty();
};
