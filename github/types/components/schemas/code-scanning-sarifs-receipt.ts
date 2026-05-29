import type { code_scanning_analysis_sarif_id } from "./code-scanning-analysis-sarif-id.js";

export type code_scanning_sarifs_receipt = {
  id?: code_scanning_analysis_sarif_id;
  /**
   * The REST API URL for checking the status of the upload.
   * @format uri
   */
  url?: string;
};
