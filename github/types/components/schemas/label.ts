/**
 * Color-coded labels help you categorize and filter your issues (just like labels in Gmail).
 */
export type label = {
  /**
   * Unique identifier for the label.
   * @format int64
   * @example 208045946
   */
  id: number;
  /**
   * @example "MDU6TGFiZWwyMDgwNDU5NDY="
   */
  node_id: string;
  /**
   * URL for the label
   * @format uri
   * @example "https://api.github.com/repositories/42/labels/bug"
   */
  url: string;
  /**
   * The name of the label.
   * @example "bug"
   */
  name: string;
  /**
   * Optional description of the label, such as its purpose.
   * @example "Something isn't working"
   */
  description: string;
  /**
   * 6-character hex code, without the leading #, identifying the color
   * @example "FFFFFF"
   */
  color: string;
  /**
   * Whether this label comes by default in a new repository.
   * @example true
   */
  default: boolean;
};
