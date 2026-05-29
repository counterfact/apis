import type { nullable_simple_user } from "./nullable-simple-user.js";
import type { author_association } from "./author-association.js";
import type { reaction_rollup } from "./reaction-rollup.js";

/**
 * Commit Comment
 */
export type commit_comment = {
  /**
   * @format uri
   */
  html_url: string;
  /**
   * @format uri
   */
  url: string;
  id: number;
  node_id: string;
  body: string;
  path: string;
  position: number;
  line: number;
  commit_id: string;
  user: nullable_simple_user;
  /**
   * @format date-time
   */
  created_at: string;
  /**
   * @format date-time
   */
  updated_at: string;
  author_association: author_association;
  reactions?: reaction_rollup;
};
