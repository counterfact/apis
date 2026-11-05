import type { Context } from "./phone-numbers/_.context.js";
import type { Routes } from "../../types/index.js";
type Route = Routes["/convai"]["/phone-numbers"];
export const POST: Route["POST"] = async ($) => {
  try { return $.response.status(200).json(($.x.context as Context).createPhone($.body)); }
  catch (error) {
    if (error instanceof Error && error.name === "PhoneError") {
      const failure = error as Error & {status: number; code: string};
      return $.x.response.status(failure.status).json({detail: {status: failure.code, message: failure.message}});
    }
    throw error;
  }
};
export const GET: Route["GET"] = async ($) => {
  try { return $.response.status(200).json(($.x.context as Context).listPhones($.query)); }
  catch (error) {
    if (error instanceof Error && error.name === "PhoneError") {
      const failure = error as Error & {status: number; code: string};
      return $.x.response.status(failure.status).json({detail: {status: failure.code, message: failure.message}});
    }
    throw error;
  }
};
