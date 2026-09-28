export type PatchFailedErrorRep = {
  /**
   * Specific error code encountered
   * @example "patch_failed"
   */
  code: string;
  /**
   * Description of the error
   * @example "Unprocessable entity. Could not apply patch."
   */
  message: string;
};
