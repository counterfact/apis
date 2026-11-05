import type { Routes } from "../../types/index.js";
type Route = Routes["/voices"]["/{voice_id}"];
export const GET: Route["GET"] = async ($) => {
  const voice = $.context.getVoice($.path.voice_id);
  if (!voice)
    return $.x.response.status(404).json({
      detail: { status: "voice_not_found", message: "Voice not found" },
    });
  return $.response.status(200).json(voice);
};

export const DELETE: Route["DELETE"] = async ($) => {
  if (!$.context.deleteVoice($.path.voice_id)) {
    return $.x.response.status(404).json({
      detail: { status: "voice_not_found", message: "Voice not found" },
    });
  }
  return $.response.status(200).json({ status: "ok" });
};
