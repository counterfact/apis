/**
 * Information about an active dismissal request for this Dependabot alert.
 */
export type dependabot_alert_dismissal_request_simple = {
  /**
   * The unique identifier of the dismissal request.
   */
  id?: number;
  /**
   * The current status of the dismissal request.
   */
  status?: "pending" | "approved" | "rejected" | "cancelled";
  /**
   * The user who requested the dismissal.
   */
  requester?: {
    /**
     * The unique identifier of the user.
     */
    id?: number;
    /**
     * The login name of the user.
     */
    login?: string;
  };
  /**
   * The date and time when the dismissal request was created.
   * @format date-time
   */
  created_at?: string;
  /**
   * The API URL to get more information about this dismissal request.
   * @format uri
   */
  url?: string;
};
