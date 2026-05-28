import type { nullable_simple_user } from "./nullable-simple-user.js";

/**
 * A collection of related issues and pull requests.
 */
export type nullable_milestone = {
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/milestones/1"
   */
  url: string;
  /**
   * @format uri
   * @example "https://github.com/octocat/Hello-World/milestones/v1.0"
   */
  html_url: string;
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/milestones/1/labels"
   */
  labels_url: string;
  /**
   * @example 1002604
   */
  id: number;
  /**
   * @example "MDk6TWlsZXN0b25lMTAwMjYwNA=="
   */
  node_id: string;
  /**
   * The number of the milestone.
   * @example 42
   */
  number: number;
  /**
   * The state of the milestone.
   * @default "open"
   * @example "open"
   */
  state: "open" | "closed";
  /**
   * The title of the milestone.
   * @example "v1.0"
   */
  title: string;
  /**
   * @example "Tracking milestone for version 1.0"
   */
  description: string;
  creator: nullable_simple_user;
  /**
   * @example 4
   */
  open_issues: number;
  /**
   * @example 8
   */
  closed_issues: number;
  /**
   * @format date-time
   * @example "2011-04-10T20:09:31Z"
   */
  created_at: string;
  /**
   * @format date-time
   * @example "2014-03-03T18:58:10Z"
   */
  updated_at: string;
  /**
   * @format date-time
   * @example "2013-02-12T13:22:01Z"
   */
  closed_at: string;
  /**
   * @format date-time
   * @example "2012-10-09T23:39:01Z"
   */
  due_on: string;
};
