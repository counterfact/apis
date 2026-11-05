import type { Routes } from "../types/index.js";
type Route = Routes["/service-accounts"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).json($.context.listAccounts());
};
export const POST: Route["POST"] = async ($) => {
  try { return $.response.status(200).json($.context.createAccount($.body)); }
  catch (error) {
    if (error instanceof Error && error.name === "ServiceAccountError") {
      const failure = error as Error & { status: number; code: string };
      return $.x.response.status(failure.status).json({ detail: { status: failure.code, message: failure.message } });
    }
    throw error;
  }
};
