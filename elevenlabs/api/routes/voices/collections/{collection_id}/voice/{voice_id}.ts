import type { Routes } from "../../../../../types/index.js";
type Route = Routes["/voices"]["/collections"]["/{collection_id}"]["/voice"]["/{voice_id}"];
export const POST: Route["POST"] = async ($) => {
  const result = $.context.addVoice($.path.collection_id, $.path.voice_id);
  if (result.error !== undefined) return $.x.response.status(404).json({ detail: { status: result.error, message: "Collection or voice not found" } });
  return $.response.status(200).json(result.value);
};
export const DELETE: Route["DELETE"] = async ($) => {
  const result = $.context.removeVoice($.path.collection_id, $.path.voice_id);
  if (result.error !== undefined) return $.x.response.status(404).json({ detail: { status: result.error, message: "Collection or voice not found" } });
  return $.response.status(200).json(result.value);
};
