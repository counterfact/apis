import type { UnixMillis } from "./UnixMillis.js";

export type ReviewResponse = {
  /**
   * The approval request ID
   * @example "12ab3c45de678910abc12345"
   */
  _id: string;
  /**
   * The type of review action to take
   * @example "approve"
   */
  kind: "approve" | "decline" | "comment";
  /**
   * Timestamp of when the request was created
   * @example "1653606981113"
   */
  creationDate?: UnixMillis;
  /**
   * A comment describing the approval response
   * @example "Approved!"
   */
  comment?: string;
  /**
   * ID of account member that reviewed request
   * @example "12ab3c45de678910abc12345"
   */
  memberId?: string;
  /**
   * ID of account service token that reviewed request
   * @example "12ab3c45de678910abc12345"
   */
  serviceTokenId?: string;
};
