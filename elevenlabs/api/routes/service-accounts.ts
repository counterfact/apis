import type { Context } from "./service-accounts/_.context.js";
import type { Routes } from "../types/index.js";
type Route = Routes["/service-accounts"];
export const GET: Route["GET"] = async ($) => {
  // Collection handlers receive the child runtime context despite the generated parent type.
  return $.response.status(200).json(($.x.context as Context).listAccounts());
};
export const POST: Route["POST"] = async ($) => {
  try { return $.response.status(200).json(($.x.context as Context).createAccount($.body)); }
  catch (error) {
    if (error instanceof Error && error.name === "ServiceAccountError") {
      const failure = error as Error & { status: number; code: string };
      return $.x.response.status(failure.status).json({ detail: { status: failure.code, message: failure.message } });
    }
    throw error;
  }
};
