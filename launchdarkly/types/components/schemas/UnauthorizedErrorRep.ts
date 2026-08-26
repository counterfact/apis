export type UnauthorizedErrorRep = {
  /**
   * Specific error code encountered
   * @example "unauthorized"
   */
  code: string;
  /**
   * Description of the error
   * @example "Invalid access token"
   */
  message: string;
};
