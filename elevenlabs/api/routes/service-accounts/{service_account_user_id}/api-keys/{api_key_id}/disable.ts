import type { Routes } from "../../../../../types/index.js";
type Route = Routes["/service-accounts"]["/{service_account_user_id}"]["/api-keys"]["/{api_key_id}"]["/disable"];
export const POST: Route["POST"] = async ($) => {
  try { return $.response.status(200).json($.context.disableKey($.path.service_account_user_id, $.path.api_key_id)); }
  catch (error) {
    if (error instanceof Error && error.name === "ServiceAccountError") {
      const failure = error as Error & { status: number; code: string };
      return $.x.response.status(failure.status).json({ detail: { status: failure.code, message: failure.message } });
    }
    throw error;
  }
};
