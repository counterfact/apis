import type { Routes } from "../../../types/index.js";
type Route =
  Routes["/service-accounts"]["/{service_account_user_id}"]["/api-keys"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
