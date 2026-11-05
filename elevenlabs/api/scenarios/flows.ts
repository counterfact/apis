import type { Scenario } from "../types/index.js";
import type { Kind } from "../routes/flows/_.context.js";
export const emptyFlowGenerations: Scenario = ($) => {
  const c = $.loadContext("/flows");
  c.generations = new Map();
  c.nextId = 1;
};
export const resetFlowGenerations: Scenario = ($) => {
  emptyFlowGenerations($);
  const c = $.loadContext("/flows");
  for (const kind of ["image", "video", "text-to-speech"] as Kind[]) {
    const id = `sim-flow-${kind}`,
      modelId =
        kind === "image"
          ? "gpt-image-1"
          : kind === "video"
            ? "veo-3.1-generate-001"
            : "eleven_flash_v2_5";
    c.generations.set(id, {
      kind,
      modelId,
      sequence: 0,
      request:
        kind === "text-to-speech"
          ? {
              model_id: modelId,
              text: "Synthetic fixture",
              voice: "sim-narrator",
            }
          : { model_id: modelId, prompt: "Synthetic fixture" },
      response: {
        id,
        status: "completed",
        content_url: `https://simulator.invalid/flows/${id}`,
        content_mime_type:
          kind === "image"
            ? "image/png"
            : kind === "video"
              ? "video/mp4"
              : "audio/mpeg",
      },
    });
  }
};
export const startFlowGenerations: Scenario = ($) => {
  for (const r of $.loadContext("/flows").generations.values())
    if (r.response.status === "pending")
      r.response = { id: r.response.id, status: "generating" };
};
export const completeFlowGenerations: Scenario = ($) => {
  for (const r of $.loadContext("/flows").generations.values())
    if (["pending", "generating"].includes(r.response.status))
      r.response = {
        id: r.response.id,
        status: "completed",
        content_url: `https://simulator.invalid/flows/${r.response.id}`,
        content_mime_type:
          r.kind === "image"
            ? "image/png"
            : r.kind === "video"
              ? "video/mp4"
              : "audio/mpeg",
      };
};
export const failFlowGenerations: Scenario = ($) => {
  for (const r of $.loadContext("/flows").generations.values())
    if (["pending", "generating"].includes(r.response.status))
      r.response = {
        id: r.response.id,
        status: "failed",
        failure_reason: "model_error",
        error_message:
          "Synthetic scenario failure; no media processing occurred.",
      };
};
