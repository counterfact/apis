import type { Routes } from "../../../../types/index.js";
type Route = Routes["/convai"]["/batch-calling"]["/{batch_id}"]["/retry"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
