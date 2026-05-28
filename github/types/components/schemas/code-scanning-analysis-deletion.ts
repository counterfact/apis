/**
 * Successful deletion of a code scanning analysis
 */
export type code_scanning_analysis_deletion = {
  /**
   * Next deletable analysis in chain, without last analysis deletion confirmation
   * @format uri
   */
  next_analysis_url: string;
  /**
   * Next deletable analysis in chain, with last analysis deletion confirmation
   * @format uri
   */
  confirm_delete_url: string;
};
