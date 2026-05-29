import type { nullable_simple_user } from "./nullable-simple-user.js";
import type { author_association } from "./author-association.js";

/**
 * A comment made to a gist.
 */
export type gist_comment = {
  /**
   * @example 1
   */
  id: number;
  /**
   * @example "MDExOkdpc3RDb21tZW50MQ=="
   */
  node_id: string;
  /**
   * @format uri
   * @example "https://api.github.com/gists/a6db0bec360bb87e9418/comments/1"
   */
  url: string;
  /**
   * The comment text.
   * @example "Body of the attachment"
   */
  body: string;
  user: nullable_simple_user;
  /**
   * @format date-time
   * @example "2011-04-18T23:23:56Z"
   */
  created_at: string;
  /**
   * @format date-time
   * @example "2011-04-18T23:23:56Z"
   */
  updated_at: string;
  author_association: author_association;
};
