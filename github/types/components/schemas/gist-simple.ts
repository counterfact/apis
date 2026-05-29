import type { public_user } from "./public-user.js";
import type { gist_history } from "./gist-history.js";
import type { nullable_simple_user } from "./nullable-simple-user.js";
import type { simple_user } from "./simple-user.js";

/**
 * Gist Simple
 */
export type gist_simple = {
  /**
   * @deprecated
   */
  forks?: Array<{
    id?: string;
    /**
     * @format uri
     */
    url?: string;
    user?: public_user;
    /**
     * @format date-time
     */
    created_at?: string;
    /**
     * @format date-time
     */
    updated_at?: string;
  }>;
  /**
   * @deprecated
   */
  history?: Array<gist_history>;
  /**
   * Gist
   */
  fork_of?: {
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
    owner?: nullable_simple_user;
    truncated?: boolean;
    forks?: Array<unknown>;
    history?: Array<unknown>;
  };
  url?: string;
  forks_url?: string;
  commits_url?: string;
  id?: string;
  node_id?: string;
  git_pull_url?: string;
  git_push_url?: string;
  html_url?: string;
  files?: {
    [key: string]: {
      filename?: string;
      type?: string;
      language?: string;
      raw_url?: string;
      size?: number;
      truncated?: boolean;
      content?: string;
      /**
       * The encoding used for `content`. Currently, `"utf-8"` and `"base64"` are supported.
       * @default "utf-8"
       */
      encoding?: string;
    };
  };
  public?: boolean;
  created_at?: string;
  updated_at?: string;
  description?: string;
  comments?: number;
  comments_enabled?: boolean;
  user?: string;
  comments_url?: string;
  owner?: simple_user;
  truncated?: boolean;
};
