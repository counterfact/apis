import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/dubbing"]["/resource"]["/{dubbing_id}"]["/speaker"]["/{speaker_id}"];
export const PATCH: Route["PATCH"] = async ($) => {
  return $.response.status(200).random();
};
