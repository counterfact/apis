export type ForbiddenErrorRep = {
  /**
   * Specific error code encountered
   * @example "forbidden"
   */
  code: string;
  /**
   * Description of the error
   * @example "Forbidden. Access to the requested resource was denied."
   */
  message: string;
};
