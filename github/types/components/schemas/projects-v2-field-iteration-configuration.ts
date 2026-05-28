/**
 * The configuration for iteration fields.
 */
export type projects_v2_field_iteration_configuration = {
  /**
   * The start date of the first iteration.
   * @format date
   */
  start_date?: string;
  /**
   * The default duration for iterations in days. Individual iterations can override this value.
   */
  duration?: number;
  /**
   * Zero or more iterations for the field.
   */
  iterations?: Array<{
    /**
     * The title of the iteration.
     */
    title?: string;
    /**
     * The start date of the iteration.
     * @format date
     */
    start_date?: string;
    /**
     * The duration of the iteration in days.
     */
    duration?: number;
  }>;
};
