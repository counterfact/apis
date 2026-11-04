import type { Routes } from "../../../../types/index.js";
type Route = Routes["/voices"]["/pvc"]["/{voice_id}"]["/samples"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
