import type { WebhookTarget } from "./WebhookTarget.js";
import type { ImageReference } from "./ImageReference.js";
import type { VideoReference } from "./VideoReference.js";
import type { AudioReference } from "./AudioReference.js";
/**
 * Request body for the ByteDance Seedance 2.5 video model.
 *
 * Diverges from the Seedance 2.0 public shape: no 4K, durations up to 30s,
 * larger reference caps, audio-only input allowed, and no ``seed`` (Ark
 * tolerates it but does not honour it).
 *
 * ByteDance models are disabled by default and require explicit approval
 * before use. Contact support to request access.
 */
export type BytedanceSeedance25Request = {
  /**
   * Include to send the generation's result to the workspace's configured flows webhooks once it completes or fails. The webhook payload matches the terminal response of the corresponding GET endpoint.
   */
  webhook?: WebhookTarget | null;
  /**
   * The model to use for the generation.
   */
  model_id: "bytedance-seedance-v2.5";
  /**
   * A text description of the video to generate.
   */
  prompt: string;
  /**
   * The aspect ratio of the output video. With `auto`, the model picks an aspect ratio based on the inputs. First-frame / first-and-last-frame tasks always use `auto`.
   * @default "16:9"
   */
  aspect_ratio?: "auto" | "21:9" | "16:9" | "4:3" | "1:1" | "3:4" | "9:16";
  /**
   * The resolution of the output video.
   * @default "720p"
   */
  resolution?: "480p" | "720p" | "1080p";
  /**
   * The duration of the output video in seconds.
   * @default 5
   */
  duration_secs?: number;
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
   * Up to 30 reference images to draw subjects from. Cannot be combined with `start_frame`/`end_frame`.
   */
  images?: Array<ImageReference>;
  /**
   * Up to 10 reference videos to draw subjects or motion from. Cannot be combined with `start_frame`/`end_frame`.
   */
  videos?: Array<VideoReference>;
  /**
   * Up to 10 reference audios, e.g. for lipsync. Cannot be combined with `start_frame`/`end_frame`.
   */
  audios?: Array<AudioReference>;
};
