/**
 * Check Annotation
 */
export type check_annotation = {
  /**
   * @example "README.md"
   */
  path: string;
  /**
   * @example 2
   */
  start_line: number;
  /**
   * @example 2
   */
  end_line: number;
  /**
   * @example 5
   */
  start_column: number;
  /**
   * @example 10
   */
  end_column: number;
  /**
   * @example "warning"
   */
  annotation_level: string;
  /**
   * @example "Spell Checker"
   */
  title: string;
  /**
   * @example "Check your spelling for 'banaas'."
   */
  message: string;
  /**
   * @example "Do you mean 'bananas' or 'banana'?"
   */
  raw_details: string;
  blob_href: string;
};
