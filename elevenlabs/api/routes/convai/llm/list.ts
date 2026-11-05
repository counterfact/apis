import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/llm"]["/list"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).json($.context.listModels());
};
