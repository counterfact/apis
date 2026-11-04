import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/workspace"]["/groups"]["/{group_id}"]["/members"]["/remove"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
