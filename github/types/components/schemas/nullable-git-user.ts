/**
 * Metaproperties for Git author/committer information.
 */
export type nullable_git_user = {
  /**
   * @example "\"Chris Wanstrath\""
   */
  name?: string;
  /**
   * @example "\"chris@ozmm.org\""
   */
  email?: string;
  /**
   * @format date-time
   * @example "\"2007-10-29T02:42:39.000-07:00\""
   */
  date?: string;
};
