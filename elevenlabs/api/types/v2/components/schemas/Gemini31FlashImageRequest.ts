import type { WebhookTarget } from "./WebhookTarget.js";
import type { ImageReference } from "./ImageReference.js";
/**
 * Request body for the Google Gemini 3.1 Flash image model.
 */
export type Gemini31FlashImageRequest = {
  /**
   * Include to send the generation's result to the workspace's configured flows webhooks once it completes or fails. The webhook payload matches the terminal response of the corresponding GET endpoint.
   */
  webhook?: WebhookTarget | null;
  /**
   * A text description of the image to generate.
   */
  prompt: string;
  /**
   * The model to use for the generation.
   */
  model_id: "gemini-3.1-flash-image";
  /**
   * Up to 14 reference images to edit or draw from.
   */
  images?: Array<ImageReference>;
  /**
   * The aspect ratio of the output image. With `auto`, the model picks an aspect ratio based on the inputs.
   * @default "16:9"
   */
  aspect_ratio?:
    | "auto"
    | "1:1"
    | "2:3"
    | "3:2"
    | "3:4"
    | "4:3"
    | "4:5"
    | "5:4"
    | "9:16"
    | "16:9"
    | "21:9"
    | "1:4"
    | "4:1"
    | "1:8"
    | "8:1";
  /**
   * The resolution of the output image.
   * @default "1K"
   */
  resolution?: "512" | "1K" | "2K" | "4K";
};
