import type { WebhookTarget } from "./WebhookTarget.js";
import type { ImageReference } from "./ImageReference.js";
/**
 * Request body for the OpenAI GPT Image 2 model.
 */
export type GPTImage2Request = {
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
   * An image whose fully transparent areas mark where the first reference image may be edited; requires `images`.
   */
  mask?: ImageReference | null;
  /**
   * The quality of the output image.
   * @default "medium"
   */
  quality?: "low" | "medium" | "high";
  /**
   * The model to use for the generation.
   */
  model_id: "gpt-image-2";
  /**
   * The aspect ratio of the output image. With `auto`, the model picks an aspect ratio based on the inputs.
   * @default "16:9"
   */
  aspect_ratio?:
    | "auto"
    | "1:1"
    | "4:5"
    | "5:4"
    | "3:4"
    | "4:3"
    | "2:3"
    | "3:2"
    | "1:2"
    | "2:1"
    | "9:16"
    | "16:9"
    | "21:9"
    | "1:3"
    | "3:1";
  /**
   * The resolution of the output image.
   * @default "1K"
   */
  resolution?: "1K" | "2K" | "4K";
};
