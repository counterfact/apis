export type MethodNotAllowedErrorRep = {
  /**
   * Specific error code encountered
   * @example "method_not_allowed"
   */
  code: string;
  /**
   * Description of the error
   * @example "Method not allowed"
   */
  message: string;
};
