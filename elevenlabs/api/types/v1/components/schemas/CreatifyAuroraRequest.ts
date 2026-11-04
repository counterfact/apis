import type { WebhookTarget } from "./WebhookTarget.js";
import type { ImageReference } from "./ImageReference.js";
import type { AudioReference } from "./AudioReference.js";
/**
 * Request body for the Creatify Aurora lipsync video model.
 */
export type CreatifyAuroraRequest = {
  /**
   * Include to send the generation's result to the workspace's configured flows webhooks once it completes or fails. The webhook payload matches the terminal response of the corresponding GET endpoint.
   */
  webhook?: WebhookTarget | null;
  /**
   * The model to use for the generation.
   */
  model_id: "creatify-aurora";
  /**
   * The image of the character to animate.
   */
  image: ImageReference;
  /**
   * The speech audio to drive the character's lip movements.
   */
  audio: AudioReference;
  /**
   * The resolution of the output video.
   * @default "720p"
   */
  resolution?: "480p" | "720p";
  /**
   * How strongly the generation adheres to the input image. Omit to use the model's default.
   */
  guidance_scale?: number | null;
  /**
   * How strongly the lip movements adhere to the audio. Omit to use the model's default.
   */
  audio_guidance_scale?: number | null;
};
