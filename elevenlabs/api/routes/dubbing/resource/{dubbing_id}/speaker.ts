import type { Routes } from "../../../../types/index.js";
type Route = Routes["/dubbing"]["/resource"]["/{dubbing_id}"]["/speaker"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
