import type { Routes } from "../../../../types/index.js";
type Route = Routes["/voices"]["/{voice_id}"]["/samples"]["/{sample_id}"];
export const DELETE: Route["DELETE"] = async ($) => {
  return $.response.status(200).random();
};
