export type ExpiringTargetError = {
  /**
   * The index of the PATCH instruction where the error occurred
   * @example 1
   */
  instructionIndex: number;
  /**
   * The error message related to a failed PATCH instruction
   * @example "example error message"
   */
  message: string;
};
