import type { Routes } from "../../../types/index.js";
type Route = Routes["/voices"]["/settings"]["/default"];
import { defaultSettings } from "../../_.context.js";
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).json(defaultSettings());
};
