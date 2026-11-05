import type { WebhookTarget } from "./WebhookTarget.js";
import type { ImageReference } from "./ImageReference.js";
/**
 * Request body for the OpenAI GPT Image 1 model.
 */
export type GPTImage1Request = {
  /**
   * Include to send the generation's result to the workspace's configured flows webhooks once it completes or fails. The webhook payload matches the terminal response of the corresponding GET endpoint.
   */
  webhook?: WebhookTarget | null;
  /**
   * A text description of the image to generate.
   */
  prompt: string;
  /**
   * Up to 5 reference images to edit or draw from.
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
   * The background of the output image. With `auto`, the model picks the background that suits the image.
   * @default "auto"
   */
  background?: "transparent" | "opaque" | "auto";
  /**
   * The aspect ratio of the output image.
   * @default "1:1"
   */
  aspect_ratio?: "1:1" | "3:2" | "2:3";
  /**
   * The model to use for the generation.
   */
  model_id: "gpt-image-1";
};
