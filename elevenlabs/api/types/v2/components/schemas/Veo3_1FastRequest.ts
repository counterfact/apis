import type { WebhookTarget } from "./WebhookTarget.js";
import type { ImageReference } from "./ImageReference.js";
import type { VeoImageReference } from "./VeoImageReference.js";
/**
 * Request body for the Google Veo 3.1 Fast video model.
 */
export type Veo3_1FastRequest = {
  /**
   * Include to send the generation's result to the workspace's configured flows webhooks once it completes or fails. The webhook payload matches the terminal response of the corresponding GET endpoint.
   */
  webhook?: WebhookTarget | null;
  /**
   * A text description of the video to generate.
   */
  prompt: string;
  /**
   * A text description of what the video should avoid.
   */
  negative_prompt?: string | null;
  /**
   * A seed for reproducible generation: the same seed and inputs give similar output across generations. Omit for random.
   */
  seed?: number | null;
  /**
   * Whether the model may rewrite the prompt to improve results.
   * @default true
   */
  enhance_prompt?: boolean;
  /**
   * The duration of the output video in seconds.
   * @default 8
   */
  duration_secs?: 4 | 6 | 8;
  /**
   * The aspect ratio of the output video.
   * @default "16:9"
   */
  aspect_ratio?: "16:9" | "9:16";
  /**
   * The resolution of the output video.
   * @default "720p"
   */
  resolution?: "720p" | "1080p" | "4K";
  /**
   * Whether to generate audio with the video.
   * @default true
   */
  generate_audio?: boolean;
  /**
   * The image to use as the video's first frame.
   */
  start_frame?: ImageReference | null;
  /**
   * The image to use as the video's last frame.
   */
  end_frame?: ImageReference | null;
  /**
   * Up to 3 reference images to draw subjects or style from. Cannot be combined with `start_frame`/`end_frame`, and requires the 8-second duration.
   */
  images?: Array<VeoImageReference>;
  /**
   * The model to use for the generation.
   */
  model_id: "veo-3.1-fast-generate-001";
};
