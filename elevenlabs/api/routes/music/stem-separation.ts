import type { Routes } from "../../types/index.js";
type Route = Routes["/music"]["/stem-separation"];
export const POST: Route["POST"] = async ($) => {
  try {
    return $.response.status(200).header("Content-Disposition", 'attachment; filename="stems.zip"').match("application/zip", Buffer.from($.context.separateStems($.body, $.query)));
  } catch (error) {
    if (error instanceof Error && error.name === "MusicError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response.status(e.status).json({ detail: { status: e.code, message: e.message } });
    }
    throw error;
  }
};
