import type { PendingBlocksMetadataModel } from "./PendingBlocksMetadataModel.js";
import type { PendingExternalAudiosMetadataModel } from "./PendingExternalAudiosMetadataModel.js";
import type { PendingClipTask } from "./PendingClipTask.js";
import type { SongSourceContext } from "./SongSourceContext.js";
import type { MusicExploreSongSourceContext } from "./MusicExploreSongSourceContext.js";
import type { SfxSourceContext } from "./SfxSourceContext.js";
import type { AudioAnalysis } from "./AudioAnalysis.js";
import type { AssetTranscription } from "./AssetTranscription.js";
export type ProjectExternalAudioResponseModel = {
  external_audio_id: string;
  filename: string;
  signed_url: string | null;
  offset_ms: number;
  duration_ms: number;
  start_time_ms: number;
  end_time_ms: number | null;
  order: string;
  track_id: string;
  created_at_ms: number;
  updated_at_ms: number;
  /**
   * @default 0
   */
  volume_gain_db?: number;
  /**
   * @default false
   */
  muted?: boolean;
  /**
   * @default 0
   */
  fade_in_ms?: number;
  /**
   * @default 0
   */
  fade_out_ms?: number;
  source_external_audio_id?: string | null;
  source_asset_id?: string | null;
  source_platform_asset_id?: string | null;
  pending_blocks_metadata?: PendingBlocksMetadataModel | null;
  pending_external_audios_metadata?: PendingExternalAudiosMetadataModel | null;
  /**
   * @default false
   */
  speech_imported?: boolean;
  pending_task?: PendingClipTask | null;
  error?: string | null;
  current_snapshot_id?: string | null;
  source_context?:
    | (
        | (SongSourceContext & { source_type: "song" })
        | (MusicExploreSongSourceContext & {
            source_type: "music_explore_song";
          })
        | (SfxSourceContext & { source_type: "sfx" })
      )
    | null;
  analysis?: AudioAnalysis | null;
  transcription?: AssetTranscription | null;
  /**
   * @default "audio"
   */
  type?: "audio";
  import_speech_progress: number | null;
};
