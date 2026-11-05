import type { ManualVerificationFileResponseModel } from "./ManualVerificationFileResponseModel.js";
/**
 * @example {"extra_text":"Please verify the voice is that of a female.","files":[{"file_id":"CwhRBWXzGAHq8TQ4Fs18","file_name":"file.mp3","mime_type":"audio/mpeg","size_bytes":1000000,"upload_date_unix":1714204800}],"request_time_unix":1714204800}
 */
export type ManualVerificationResponseModel = {
  /**
   * The extra text of the manual verification.
   */
  extra_text: string;
  /**
   * The date of the manual verification in Unix time.
   */
  request_time_unix: number;
  /**
   * The files of the manual verification.
   */
  files: Array<ManualVerificationFileResponseModel>;
};
