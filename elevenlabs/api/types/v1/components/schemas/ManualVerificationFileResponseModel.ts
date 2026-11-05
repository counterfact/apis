/**
 * @example {"file_id":"CwhRBWXzGAHq8TQ4Fs18","file_name":"file.mp3","mime_type":"audio/mpeg","size_bytes":1000000,"upload_date_unix":1714204800}
 */
export type ManualVerificationFileResponseModel = {
  /**
   * The ID of the file.
   */
  file_id: string;
  /**
   * The name of the file.
   */
  file_name: string;
  /**
   * The MIME type of the file.
   */
  mime_type: string;
  /**
   * The size of the file in bytes.
   */
  size_bytes: number;
  /**
   * The date of the file in Unix time.
   */
  upload_date_unix: number;
};
