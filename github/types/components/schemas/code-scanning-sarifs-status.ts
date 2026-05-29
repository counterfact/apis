export type code_scanning_sarifs_status = {
  /**
   * `pending` files have not yet been processed, while `complete` means results from the SARIF have been stored. `failed` files have either not been processed at all, or could only be partially processed.
   */
  processing_status?: "pending" | "complete" | "failed";
  /**
   * The REST API URL for getting the analyses associated with the upload.
   * @format uri
   */
  analyses_url?: string;
  /**
   * Any errors that ocurred during processing of the delivery.
   */
  errors?: Array<string>;
};
