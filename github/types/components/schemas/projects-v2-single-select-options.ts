/**
 * An option for a single select field
 */
export type projects_v2_single_select_options = {
  /**
   * The unique identifier of the option.
   */
  id: string;
  /**
   * The display name of the option, in raw text and HTML formats.
   */
  name: { raw: string; html: string };
  /**
   * The description of the option, in raw text and HTML formats.
   */
  description: { raw: string; html: string };
  /**
   * The color associated with the option.
   */
  color: string;
};
