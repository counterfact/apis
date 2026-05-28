export type actions_variable = {
  /**
   * The name of the variable.
   * @example "USERNAME"
   */
  name: string;
  /**
   * The value of the variable.
   * @example "octocat"
   */
  value: string;
  /**
   * The date and time at which the variable was created, in ISO 8601 format':' YYYY-MM-DDTHH:MM:SSZ.
   * @format date-time
   * @example "2019-01-24T22:45:36.000Z"
   */
  created_at: string;
  /**
   * The date and time at which the variable was last updated, in ISO 8601 format':' YYYY-MM-DDTHH:MM:SSZ.
   * @format date-time
   * @example "2019-01-24T22:45:36.000Z"
   */
  updated_at: string;
};
