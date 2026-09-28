export type StatusServiceUnavailable = {
  /**
   * Specific error code encountered
   * @example "service_unavailable"
   */
  code: string;
  /**
   * Description of the error
   * @example "Requested service unavailable"
   */
  message: string;
};
