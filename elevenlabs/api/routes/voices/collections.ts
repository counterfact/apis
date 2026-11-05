import type { Routes } from "../../types/index.js";
type Route = Routes["/voices"]["/collections"];
export const GET: Route["GET"] = async ($) => {
  const context = $.context;
  return $.response.status(200).json(context.listCollections());
};
export const POST: Route["POST"] = async ($) => {
  const context = $.context;
  return $.response.status(200).json(context.createCollection($.body));
};
