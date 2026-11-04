import type { Routes } from "../../../../../../types/index.js";
type Route =
  Routes["/dubbing"]["/resource"]["/{dubbing_id}"]["/segment"]["/{segment_id}"]["/{language}"];
export const PATCH: Route["PATCH"] = async ($) => {
  return $.response.status(200).random();
};
