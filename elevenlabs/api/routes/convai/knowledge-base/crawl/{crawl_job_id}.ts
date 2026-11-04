import type { Routes } from "../../../../types/index.js";
type Route = Routes["/convai"]["/knowledge-base"]["/crawl"]["/{crawl_job_id}"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
