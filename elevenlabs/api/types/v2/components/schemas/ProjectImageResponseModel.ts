import type { CanvasPlacement } from "./CanvasPlacement.js";
import type { ClipAnimation } from "./ClipAnimation.js";
import type { PendingClipTask } from "./PendingClipTask.js";
import type { ImageAnalysis } from "./ImageAnalysis.js";
export type ProjectImageResponseModel = {
  image_id: string;
  filename: string;
  signed_url?: string | null;
  thumbnail_signed_url?: string | null;
  /**
   * @default "image"
   */
  type?: "image";
  /**
   * @default "upload"
   */
  source?: "upload";
  file_size_bytes: number;
  width: number;
  height: number;
  /**
   * @default "v0"
   */
  track_id?: string;
  offset_ms: number;
  duration_ms: number;
  order: string;
  canvas_placement: CanvasPlacement;
  /**
   * @default {"enter_effect":"none","enter_duration_ms":0,"exit_effect":"none","exit_duration_ms":0}
   */
  animation?: ClipAnimation;
  /**
   * @default 1
   */
  opacity?: number;
  created_at_ms: number;
  updated_at_ms: number;
  current_snapshot_id?: string | null;
  source_asset_id?: string | null;
  source_platform_asset_id?: string | null;
  error?: string | null;
  pending_task?: PendingClipTask | null;
  analysis?: ImageAnalysis | null;
};
