import type { Routes } from "../../../types/index.js";
type Route = Routes["/voices"]["/collections"]["/{collection_id}"];
export const GET: Route["GET"] = async ($) => {
  const collection = $.context.getCollection($.path.collection_id);
  if (!collection) return $.x.response.status(404).json({ detail: { status: "collection_not_found", message: "Collection not found" } });
  return $.response.status(200).json(collection);
};
export const PATCH: Route["PATCH"] = async ($) => {
  const collection = $.context.updateCollection($.path.collection_id, $.body);
  if (!collection) return $.x.response.status(404).json({ detail: { status: "collection_not_found", message: "Collection not found" } });
  return $.response.status(200).json(collection);
};
export const DELETE: Route["DELETE"] = async ($) => {
  const collection = $.context.deleteCollection($.path.collection_id);
  if (!collection) return $.x.response.status(404).json({ detail: { status: "collection_not_found", message: "Collection not found" } });
  return $.response.status(200).json(collection);
};
