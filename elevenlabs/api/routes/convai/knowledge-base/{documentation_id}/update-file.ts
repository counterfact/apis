import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/convai"]["/knowledge-base"]["/{documentation_id}"]["/update-file"];
export const PATCH: Route["PATCH"] = async ($) => {
  return $.response.status(200).random();
};
