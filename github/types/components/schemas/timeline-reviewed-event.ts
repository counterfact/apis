import type { simple_user } from "./simple-user.js";
import type { author_association } from "./author-association.js";

/**
 * Timeline Reviewed Event
 */
export type timeline_reviewed_event = {
  event: string;
  /**
   * Unique identifier of the review
   * @example 42
   */
  id: number;
  /**
   * @example "MDE3OlB1bGxSZXF1ZXN0UmV2aWV3ODA="
   */
  node_id: string;
  user: simple_user;
  /**
   * The text of the review.
   * @example "This looks great."
   */
  body: string;
  /**
   * @example "CHANGES_REQUESTED"
   */
  state: string;
  /**
   * @format uri
   * @example "https://github.com/octocat/Hello-World/pull/12#pullrequestreview-80"
   */
  html_url: string;
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/pulls/12"
   */
  pull_request_url: string;
  _links: { html: { href: string }; pull_request: { href: string } };
  /**
   * @format date-time
   */
  submitted_at?: string;
  /**
   * @format date-time
   */
  updated_at?: string;
  /**
   * A commit SHA for the review.
   * @example "54bb654c9e6025347f57900a4a5c2313a96b8035"
   */
  commit_id: string;
  body_html?: string;
  body_text?: string;
  author_association: author_association;
};
