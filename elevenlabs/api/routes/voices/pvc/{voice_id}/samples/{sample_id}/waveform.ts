import type { Routes } from "../../../../../../types/index.js";
type Route =
  Routes["/voices"]["/pvc"]["/{voice_id}"]["/samples"]["/{sample_id}"]["/waveform"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
