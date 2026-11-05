import type { Context } from "./collections/_.context.js";
import type { Routes } from "../../types/index.js";
type Route = Routes["/voices"]["/collections"];
export const GET: Route["GET"] = async ($) => {
  // Collection files use their parent's generated context type; runtime uses the child.
  const context = $.x.context as Context;
  return $.response.status(200).json(context.listCollections());
};
export const POST: Route["POST"] = async ($) => {
  const context = $.x.context as Context;
  return $.response.status(200).json(context.createCollection($.body));
};
