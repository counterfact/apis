import type { Routes } from "../../../types/index.js";
type Route = Routes["/service-accounts"]["/{service_account_user_id}"]["/api-keys"];
export const GET: Route["GET"] = async ($) => {
  try { return $.response.status(200).json($.context.listKeys($.path.service_account_user_id)); }
  catch (error) {
    if (error instanceof Error && error.name === "ServiceAccountError") {
      const failure = error as Error & { status: number; code: string };
      return $.x.response.status(failure.status).json({ detail: { status: failure.code, message: failure.message } });
    }
    throw error;
  }
};
export const POST: Route["POST"] = async ($) => {
  try { return $.response.status(200).json($.context.createKey($.path.service_account_user_id, $.body)); }
  catch (error) {
    if (error instanceof Error && error.name === "ServiceAccountError") {
      const failure = error as Error & { status: number; code: string };
      return $.x.response.status(failure.status).json({ detail: { status: failure.code, message: failure.message } });
    }
    throw error;
  }
};
