export type Variation = {
  /**
   * The ID of the variation. Leave empty when you are creating a flag.
   */
  _id?: string;
  /**
   * The value of the variation. For boolean flags, this must be <code>true</code> or <code>false</code>. For multivariate flags, this may be a string, number, or JSON object.
   */
  value: unknown;
  /**
   * Description of the variation. Defaults to an empty string, but is omitted from the response if not set.
   */
  description?: string;
  /**
   * A human-friendly name for the variation. Defaults to an empty string, but is omitted from the response if not set.
   */
  name?: string;
};
