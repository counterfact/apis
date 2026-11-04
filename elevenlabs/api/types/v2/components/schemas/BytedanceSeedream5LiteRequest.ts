import type { WebhookTarget } from "./WebhookTarget.js";
import type { ImageReference } from "./ImageReference.js";
/**
 * Request body for the ByteDance Seedream 5.0 Lite image model.
 *
 * ByteDance models are disabled by default and require explicit approval
 * before use. Contact support to request access.
 */
export type BytedanceSeedream5LiteRequest = {
  /**
   * Include to send the generation's result to the workspace's configured flows webhooks once it completes or fails. The webhook payload matches the terminal response of the corresponding GET endpoint.
   */
  webhook?: WebhookTarget | null;
  /**
   * A text description of the image to generate.
   */
  prompt: string;
  /**
   * Up to 10 reference images to edit or draw from.
   */
  images?: Array<ImageReference>;
  /**
   * The aspect ratio of the output image. With `auto`, the model picks an aspect ratio based on the inputs.
   * @default "16:9"
   */
  aspect_ratio?: "auto" | "1:1" | "3:4" | "16:9" | "4:3" | "9:16";
  /**
   * A seed for reproducible generation: the same seed and inputs give similar output across generations. Omit for random.
   */
  seed?: number | null;
  /**
   * The model to use for the generation.
   */
  model_id: "bytedance-seedream-5-lite";
  /**
   * The resolution of the output image.
   * @default "2K"
   */
  resolution?: "2K" | "3K";
};
