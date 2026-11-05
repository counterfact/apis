/**
 * @example {"status":"ok"}
 */
export type RequestPVCManualVerificationResponseModel = {
  /**
   * The status of the request PVC manual verification request. If the request was successful, the status will be 'ok'. Otherwise an error message with status 500 will be returned.
   */
  status: string;
};
