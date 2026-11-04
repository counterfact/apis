import type { Routes } from "../../../types/index.js";
type Route =
  Routes["/voices"]["/{voice_id}"]["/replicate-to-isolated-environment"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
