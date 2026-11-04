/**
 * @example {"mime_type":"audio/mpeg","recording_id":"CwhRBWXzGAHq8TQ4Fs17","size_bytes":1000000,"transcription":"Hello, how are you?","upload_date_unix":1714204800}
 */
export type RecordingResponseModel = {
  /**
   * The ID of the recording.
   */
  recording_id: string;
  /**
   * The MIME type of the recording.
   */
  mime_type: string;
  /**
   * The size of the recording in bytes.
   */
  size_bytes: number;
  /**
   * The date of the recording in Unix time.
   */
  upload_date_unix: number;
  /**
   * The transcription of the recording.
   */
  transcription: string;
};
