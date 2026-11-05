import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/phone-numbers"]["/{phone_number_id}"];
export const GET: Route["GET"] = async ($) => {
  try { return $.response.status(200).json($.context.getPhone($.path.phone_number_id)); }
  catch (error) {
    if (error instanceof Error && error.name === "PhoneError") {
      const failure = error as Error & {status: number; code: string};
      return $.x.response.status(failure.status).json({detail: {status: failure.code, message: failure.message}});
    }
    throw error;
  }
};
export const DELETE: Route["DELETE"] = async ($) => {
  try { return $.response.status(200).json($.context.deletePhone($.path.phone_number_id)); }
  catch (error) {
    if (error instanceof Error && error.name === "PhoneError") {
      const failure = error as Error & {status: number; code: string};
      return $.x.response.status(failure.status).json({detail: {status: failure.code, message: failure.message}});
    }
    throw error;
  }
};
export const PATCH: Route["PATCH"] = async ($) => {
  try { return $.response.status(200).json($.context.updatePhone($.path.phone_number_id, $.body)); }
  catch (error) {
    if (error instanceof Error && error.name === "PhoneError") {
      const failure = error as Error & {status: number; code: string};
      return $.x.response.status(failure.status).json({detail: {status: failure.code, message: failure.message}});
    }
    throw error;
  }
};
