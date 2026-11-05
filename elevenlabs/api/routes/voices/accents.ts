import type { Routes } from "../../types/index.js";
type Route = Routes["/voices"]["/accents"];
export const GET: Route["GET"] = async ($) => {
  try {
    if (!$.context.voiceLibrary) throw new Error("Run startup or reset");
    return $.response.status(200).json($.context.voiceLibrary.accents($.query));
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
