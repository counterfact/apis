export type NotFoundErrorRep = {
  /**
   * Specific error code encountered
   * @example "not_found"
   */
  code: string;
  /**
   * Description of the error
   * @example "Invalid resource identifier"
   */
  message: string;
};
