export type InvalidRequestErrorRep = {
  /**
   * Specific error code encountered
   * @example "invalid_request"
   */
  code: string;
  /**
   * Description of the error
   * @example "Invalid request body"
   */
  message: string;
};
