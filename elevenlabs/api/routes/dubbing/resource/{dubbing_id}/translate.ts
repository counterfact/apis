import type { Routes } from "../../../../types/index.js";
type Route = Routes["/dubbing"]["/resource"]["/{dubbing_id}"]["/translate"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
