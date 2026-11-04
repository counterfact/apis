import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/service-accounts"]["/{service_account_user_id}"]["/api-keys"]["/{api_key_id}"]["/disable"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
