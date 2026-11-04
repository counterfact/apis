/**
 * Custom hold audio played on loop to callers waiting in the agent's queue.
 *
 * Set by uploading a file through the agent hold-audio endpoint. Values sent in
 * agent create or update requests are ignored.
 */
export type AgentHoldAudioConfig = {
  /**
   * Storage path of the uploaded clip
   */
  audio_path: string;
  /**
   * Public CDN URL of the uploaded clip
   */
  audio_url: string;
  /**
   * Filename of the uploaded clip as provided by the user
   */
  original_filename: string;
  /**
   * Duration of the uploaded clip in seconds
   */
  duration_secs: number;
  /**
   * Size of the uploaded clip in bytes
   */
  size_bytes: number;
};
