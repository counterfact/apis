import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/v2"]["/phone-numbers"];
export const GET: Route["GET"] = async ($) => {
  try { return $.response.status(200).json($.context.listPhoneNumbers($.query)); }
  catch (error) {
    if (error instanceof Error && error.name === "PhoneError") {
      const failure = error as Error & {status: number; code: string};
      return $.x.response.status(failure.status).json({detail: {status: failure.code, message: failure.message}});
    }
    throw error;
  }
};
