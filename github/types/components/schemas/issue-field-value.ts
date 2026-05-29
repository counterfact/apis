/**
 * A value assigned to an issue field
 */
export type issue_field_value = {
  /**
   * Unique identifier for the issue field.
   * @format int64
   * @example 1
   */
  issue_field_id: number;
  /**
   * @example "IFT_GDKND"
   */
  node_id: string;
  /**
   * The data type of the issue field
   * @example "text"
   */
  data_type: "text" | "single_select" | "number" | "date";
  /**
   * The value of the issue field
   */
  value: string | number | number;
  /**
   * Details about the selected option (only present for single_select fields)
   */
  single_select_option?: {
    /**
     * Unique identifier for the option.
     * @format int64
     * @example 1
     */
    id: number;
    /**
     * The name of the option
     * @example "High"
     */
    name: string;
    /**
     * The color of the option
     * @example "red"
     */
    color: string;
  };
};
