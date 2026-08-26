export type StatusConflictErrorRep = {
  /**
   * Specific error code encountered
   * @example "optimistic_locking_error"
   */
  code: string;
  /**
   * Description of the error
   * @example "Conflict. Optimistic lock error. Try again later."
   */
  message: string;
};
