import type { Routes } from "../../../../types/index.js";
type Route = Routes["/voices"]["/{voice_id}"]["/settings"]["/edit"];
export const POST: Route["POST"] = async ($) => {
  if (!$.context.editSettings($.path.voice_id, $.body)) {
    return $.x.response.status(404).json({
      detail: { status: "voice_not_found", message: "Voice not found" },
    });
  }
  return $.response.status(200).json({ status: "ok" });
};
