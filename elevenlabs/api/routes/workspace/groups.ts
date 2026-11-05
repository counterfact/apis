import type { Context } from "./groups/_.context.js";
import type { Routes } from "../../types/index.js";
type Route = Routes["/workspace"]["/groups"];
export const GET: Route["GET"] = async ($) => {
  // Collection runtime resolves the child context; generated type resolves its parent.
  return $.response.status(200).json(($.x.context as Context).listGroups());
};
