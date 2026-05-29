import type { team } from "./team.js";

/**
 * Branch Restriction Policy
 */
export type branch_restriction_policy = {
  /**
   * @format uri
   */
  url: string;
  /**
   * @format uri
   */
  users_url: string;
  /**
   * @format uri
   */
  teams_url: string;
  /**
   * @format uri
   */
  apps_url: string;
  users: Array<{
    login?: string;
    /**
     * @format int64
     */
    id?: number;
    node_id?: string;
    avatar_url?: string;
    gravatar_id?: string;
    url?: string;
    html_url?: string;
    followers_url?: string;
    following_url?: string;
    gists_url?: string;
    starred_url?: string;
    subscriptions_url?: string;
    organizations_url?: string;
    repos_url?: string;
    events_url?: string;
    received_events_url?: string;
    type?: string;
    site_admin?: boolean;
    user_view_type?: string;
  }>;
  teams: Array<team>;
  apps: Array<{
    id?: number;
    slug?: string;
    node_id?: string;
    owner?: {
      login?: string;
      id?: number;
      node_id?: string;
      url?: string;
      repos_url?: string;
      events_url?: string;
      hooks_url?: string;
      issues_url?: string;
      members_url?: string;
      public_members_url?: string;
      avatar_url?: string;
      description?: string;
      /**
       * @example "\"\""
       */
      gravatar_id?: string;
      /**
       * @example "\"https://github.com/testorg-ea8ec76d71c3af4b\""
       */
      html_url?: string;
      /**
       * @example "\"https://api.github.com/users/testorg-ea8ec76d71c3af4b/followers\""
       */
      followers_url?: string;
      /**
       * @example "\"https://api.github.com/users/testorg-ea8ec76d71c3af4b/following{/other_user}\""
       */
      following_url?: string;
      /**
       * @example "\"https://api.github.com/users/testorg-ea8ec76d71c3af4b/gists{/gist_id}\""
       */
      gists_url?: string;
      /**
       * @example "\"https://api.github.com/users/testorg-ea8ec76d71c3af4b/starred{/owner}{/repo}\""
       */
      starred_url?: string;
      /**
       * @example "\"https://api.github.com/users/testorg-ea8ec76d71c3af4b/subscriptions\""
       */
      subscriptions_url?: string;
      /**
       * @example "\"https://api.github.com/users/testorg-ea8ec76d71c3af4b/orgs\""
       */
      organizations_url?: string;
      /**
       * @example "\"https://api.github.com/users/testorg-ea8ec76d71c3af4b/received_events\""
       */
      received_events_url?: string;
      /**
       * @example "\"Organization\""
       */
      type?: string;
      /**
       * @example false
       */
      site_admin?: boolean;
      /**
       * @example "public"
       */
      user_view_type?: string;
    };
    name?: string;
    client_id?: string;
    description?: string;
    external_url?: string;
    html_url?: string;
    created_at?: string;
    updated_at?: string;
    permissions?: {
      metadata?: string;
      contents?: string;
      issues?: string;
      single_file?: string;
    };
    events?: Array<string>;
  }>;
};
