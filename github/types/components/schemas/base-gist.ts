import type { nullable_simple_user } from "./nullable-simple-user.js";
import type { simple_user } from "./simple-user.js";

/**
 * Base Gist
 */
export type base_gist = {
  /**
   * @format uri
   */
  url: string;
  /**
   * @format uri
   */
  forks_url: string;
  /**
   * @format uri
   */
  commits_url: string;
  id: string;
  node_id: string;
  /**
   * @format uri
   */
  git_pull_url: string;
  /**
   * @format uri
   */
  git_push_url: string;
  /**
   * @format uri
   */
  html_url: string;
  files: {
    [key: string]: {
      filename?: string;
      type?: string;
      language?: string;
      raw_url?: string;
      size?: number;
      /**
       * The encoding used for `content`. Currently, `"utf-8"` and `"base64"` are supported.
       * @default "utf-8"
       */
      encoding?: string;
    };
  };
  public: boolean;
  /**
   * @format date-time
   */
  created_at: string;
  /**
   * @format date-time
   */
  updated_at: string;
  description: string;
  comments: number;
  comments_enabled?: boolean;
  user: nullable_simple_user;
  /**
   * @format uri
   */
  comments_url: string;
  owner?: simple_user;
  truncated?: boolean;
  forks?: Array<unknown>;
  history?: Array<unknown>;
};
