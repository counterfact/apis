import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/realtime"]["/client_secrets"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
