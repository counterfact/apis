export type FileRep = {
  /**
   * The imported file name, including the extension
   * @example "bigsegimport.csv"
   */
  filename?: string;
  /**
   * The imported file status
   * @example "complete"
   */
  status?: string;
};
