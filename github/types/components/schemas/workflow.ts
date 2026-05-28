/**
 * A GitHub Actions workflow
 */
export type workflow = {
  /**
   * @example 5
   */
  id: number;
  /**
   * @example "MDg6V29ya2Zsb3cxMg=="
   */
  node_id: string;
  /**
   * @example "CI"
   */
  name: string;
  /**
   * @example "ruby.yaml"
   */
  path: string;
  /**
   * @example "active"
   */
  state:
    | "active"
    | "deleted"
    | "disabled_fork"
    | "disabled_inactivity"
    | "disabled_manually";
  /**
   * @format date-time
   * @example "2019-12-06T14:20:20.000Z"
   */
  created_at: string;
  /**
   * @format date-time
   * @example "2019-12-06T14:20:20.000Z"
   */
  updated_at: string;
  /**
   * @example "https://api.github.com/repos/actions/setup-ruby/workflows/5"
   */
  url: string;
  /**
   * @example "https://github.com/actions/setup-ruby/blob/master/.github/workflows/ruby.yaml"
   */
  html_url: string;
  /**
   * @example "https://github.com/actions/setup-ruby/workflows/CI/badge.svg"
   */
  badge_url: string;
  /**
   * @format date-time
   * @example "2019-12-06T14:20:20.000Z"
   */
  deleted_at?: string;
};
