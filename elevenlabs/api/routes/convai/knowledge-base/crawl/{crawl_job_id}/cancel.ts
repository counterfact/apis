import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/convai"]["/knowledge-base"]["/crawl"]["/{crawl_job_id}"]["/cancel"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
