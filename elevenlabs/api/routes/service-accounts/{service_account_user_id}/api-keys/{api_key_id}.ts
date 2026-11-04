import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/service-accounts"]["/{service_account_user_id}"]["/api-keys"]["/{api_key_id}"];
export const PATCH: Route["PATCH"] = async ($) => {
  return $.response.status(200).random();
};
export const DELETE: Route["DELETE"] = async ($) => {
  return $.response.status(200).random();
};
