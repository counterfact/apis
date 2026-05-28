/**
 * An iteration setting for an iteration field
 */
export type projects_v2_iteration_settings = {
  /**
   * The unique identifier of the iteration setting.
   */
  id: string;
  /**
   * The start date of the iteration.
   * @format date
   */
  start_date: string;
  /**
   * The duration of the iteration in days.
   */
  duration: number;
  /**
   * The iteration title, in raw text and HTML formats.
   */
  title: { raw: string; html: string };
  /**
   * Whether the iteration has been completed.
   */
  completed: boolean;
};
