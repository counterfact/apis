import type { pull_request_minimal } from "./pull-request-minimal.js";

export type pull_request_review_comment_event = {
  action: string;
  pull_request: pull_request_minimal;
  comment: {
    id: number;
    node_id: string;
    /**
     * @format uri
     */
    url: string;
    pull_request_review_id: number;
    diff_hunk: string;
    path: string;
    position: number;
    original_position: number;
    subject_type?: string;
    commit_id: string;
    user: {
      /**
       * @format uri
       */
      avatar_url?: string;
      deleted?: boolean;
      email?: string;
      /**
       * @format uri-template
       */
      events_url?: string;
      /**
       * @format uri
       */
      followers_url?: string;
      /**
       * @format uri-template
       */
      following_url?: string;
      /**
       * @format uri-template
       */
      gists_url?: string;
      gravatar_id?: string;
      /**
       * @format uri
       */
      html_url?: string;
      /**
       * @format int64
       */
      id?: number;
      login?: string;
      name?: string;
      node_id?: string;
      /**
       * @format uri
       */
      organizations_url?: string;
      /**
       * @format uri
       */
      received_events_url?: string;
      /**
       * @format uri
       */
      repos_url?: string;
      site_admin?: boolean;
      /**
       * @format uri-template
       */
      starred_url?: string;
      /**
       * @format uri
       */
      subscriptions_url?: string;
      type?: "Bot" | "User" | "Organization";
      /**
       * @format uri
       */
      url?: string;
      user_view_type?: string;
    };
    body: string;
    /**
     * @format date-time
     */
    created_at: string;
    /**
     * @format date-time
     */
    updated_at: string;
    /**
     * @format uri
     */
    html_url: string;
    /**
     * @format uri
     */
    pull_request_url: string;
    _links: {
      html: {
        /**
         * @format uri-template
         */
        href: string;
      };
      pull_request: {
        /**
         * @format uri-template
         */
        href: string;
      };
      self: {
        /**
         * @format uri-template
         */
        href: string;
      };
    };
    original_commit_id: string;
    reactions: {
      "+1"?: number;
      "-1"?: number;
      confused?: number;
      eyes?: number;
      heart?: number;
      hooray?: number;
      laugh?: number;
      rocket?: number;
      total_count?: number;
      /**
       * @format uri
       */
      url?: string;
    };
    in_reply_to_id?: number;
  };
};
