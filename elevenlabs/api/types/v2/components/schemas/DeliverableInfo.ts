/**
 * @example {"content_type":"video/mp4","name":"[fr][mp4] Item #cbaba1fe","signed_url":"https://storage.googleapis.com/example-bucket/deliverables/output_fr.mp4?X-Goog-Signature=...","version":1}
 */
export type DeliverableInfo = {
  /**
   * A time-limited URL to download the delivered file.
   */
  signed_url: string;
  /**
   * The MIME type of the delivered file (e.g. 'video/mp4').
   */
  content_type: string;
  /**
   * The name of the delivered file.
   */
  name: string;
  /**
   * The version number of the deliverable.
   * @default 1
   */
  version?: number;
};
