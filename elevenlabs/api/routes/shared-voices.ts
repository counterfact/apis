import type { Routes } from "../types/index.js";
type Route = Routes["/shared-voices"];
export const GET: Route["GET"] = async ($) => {
  try {
    const value = $.context.list($.query);
    return $.response.status(200).json(value);
  } catch (error) {
    if (error instanceof Error && error.name === "LibraryError")
      return $.x.response
        .status(400)
        .json({
          detail: {
            status: "invalid_voice_library_query",
            message: error.message,
          },
        });
    throw error;
  }
};
