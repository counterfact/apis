import type { DubbingMediaMetadata } from "./DubbingMediaMetadata.js";
/**
 * @example {"created_at":"2025-07-15T14:49:41.149000","dubbing_id":"21m00Tcm4TlvDq8ikWAM","editable":true,"media_metadata":{"content_type":"video/mp4","duration":127.5},"name":"My Dubbing Project","source_language":"en","status":"dubbed","target_languages":["es","fr","de"]}
 */
export type DubbingMetadataResponse = {
  /**
   * The ID of the dubbing project.
   */
  dubbing_id: string;
  /**
   * The name of the dubbing project.
   */
  name: string;
  /**
   * The state this dub is in.
   */
  status: string;
  /**
   * Once dubbing has completed, the ISO-639-1 code of the original media's source language.
   */
  source_language: string | null;
  /**
   * The ISO-639-1 code of the languages this media has been dubbed into.
   */
  target_languages: Array<string>;
  /**
   * Whether this dubbing project is editable in Dubbing Studio.
   * @default false
   */
  editable?: boolean;
  /**
   * Timestamp this dub was created.
   * @format date-time
   */
  created_at: string;
  /**
   * Metadata, such as the length in seconds and content type, of the dubbed content.
   */
  media_metadata?: DubbingMediaMetadata | null;
  /**
   * Error message indicate, if this dub has failed, what happened.
   */
  error?: string | null;
};
