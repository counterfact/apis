import type { Routes } from "../../../../../../types/index.js";
type Route =
  Routes["/dubbing"]["/resource"]["/{dubbing_id}"]["/speaker"]["/{speaker_id}"]["/segment"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(201).random();
};
