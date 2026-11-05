import type { DeliverableInfo } from "./DeliverableInfo.js";
/**
 * @example {"deliverables":[{"content_type":"video/mp4","name":"output_fr.mp4","signed_url":"https://storage.googleapis.com/example-bucket/deliverables/output_fr.mp4?X-Goog-Signature=...","version":1}]}
 */
export type OrderDeliverablesResponse = {
  /**
   * The list of delivered files for the order. Empty if the order is not yet completed.
   */
  deliverables: Array<DeliverableInfo>;
};
