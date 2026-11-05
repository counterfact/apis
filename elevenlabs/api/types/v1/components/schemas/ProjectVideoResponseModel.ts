import type { ProjectVideoThumbnailSheetResponseModel } from "./ProjectVideoThumbnailSheetResponseModel.js";
import type { PendingBlocksMetadataModel } from "./PendingBlocksMetadataModel.js";
import type { PendingExternalAudiosMetadataModel } from "./PendingExternalAudiosMetadataModel.js";
import type { PendingClipTask } from "./PendingClipTask.js";
import type { GenerationSourceContext } from "./GenerationSourceContext.js";
import type { VideoAnalysis } from "./VideoAnalysis.js";
import type { AssetTranscription } from "./AssetTranscription.js";
import type { CanvasPlacement } from "./CanvasPlacement.js";
import type { ClipAnimation } from "./ClipAnimation.js";
export type ProjectVideoResponseModel = {
  video_id: string;
  filename: string;
  signed_url: string | null;
  signed_preview_url: string | null;
  offset_ms: number;
  duration_ms: number;
  volume_gain_db: number;
  muted: boolean;
  /**
   * @default 0
   */
  fade_in_ms?: number;
  /**
   * @default 0
   */
  fade_out_ms?: number;
  width: number;
  height: number;
  codec: string;
  order: string;
  created_at_ms: number;
  updated_at_ms: number;
  error?: string | null;
  thumbnail_interval_seconds: number;
  thumbnail_size: [number, number];
  thumbnail_sheets: Array<ProjectVideoThumbnailSheetResponseModel>;
  start_time_ms: number;
  end_time_ms: number | null;
  asset_preview_signed_url?: string | null;
  source_video_id?: string | null;
  source_asset_id?: string | null;
  source_platform_asset_id?: string | null;
  pending_blocks_metadata?: PendingBlocksMetadataModel | null;
  pending_external_audios_metadata?: PendingExternalAudiosMetadataModel | null;
  /**
   * @default false
   */
  speech_imported?: boolean;
  pending_task?: PendingClipTask | null;
  /**
   * @default true
   */
  audio_track_ready?: boolean;
  /**
   * @default true
   */
  export_format_ready?: boolean;
  current_snapshot_id?: string | null;
  source_context?: GenerationSourceContext | null;
  analysis?: VideoAnalysis | null;
  transcription?: AssetTranscription | null;
  /**
   * @default "video"
   */
  type?: "video";
  canvas_placement?: CanvasPlacement;
  animation?: ClipAnimation;
  /**
   * @default 1
   */
  playback_speed?: number;
  /**
   * @default 1
   */
  opacity?: number;
  /**
   * @default "v0"
   */
  track_id?: string;
  preview_job_progress: number;
  import_speech_progress: number | null;
};
