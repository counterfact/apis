import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/voices"]["/pvc"]["/{voice_id}"]["/samples"]["/{sample_id}"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
export const DELETE: Route["DELETE"] = async ($) => {
  return $.response.status(200).random();
};
