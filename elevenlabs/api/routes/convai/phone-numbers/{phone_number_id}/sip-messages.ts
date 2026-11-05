import type { Routes } from "../../../../types/index.js";
type Route = Routes["/convai"]["/phone-numbers"]["/{phone_number_id}"]["/sip-messages"];
export const GET: Route["GET"] = async ($) => {
  try { return $.response.status(200).json($.context.listSipMessages($.path.phone_number_id, $.query)); }
  catch (error) {
    if (error instanceof Error && error.name === "PhoneError") {
      const failure = error as Error & {status: number; code: string};
      return $.x.response.status(failure.status).json({detail: {status: failure.code, message: failure.message}});
    }
    throw error;
  }
};
