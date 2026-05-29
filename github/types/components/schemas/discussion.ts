import type { label } from "./label.js";

/**
 * A Discussion in a repository.
 */
export type discussion = {
  active_lock_reason: string;
  answer_chosen_at: string;
  answer_chosen_by: {
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
    id: number;
    login: string;
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
  answer_html_url: string;
  /**
   * How the author is associated with the repository.
   */
  author_association?:
    | "COLLABORATOR"
    | "CONTRIBUTOR"
    | "FIRST_TIMER"
    | "FIRST_TIME_CONTRIBUTOR"
    | "MANNEQUIN"
    | "MEMBER"
    | "NONE"
    | "OWNER";
  body: string;
  category: {
    /**
     * @format date-time
     */
    created_at: string;
    description: string;
    emoji: string;
    id: number;
    is_answerable: boolean;
    name: string;
    node_id?: string;
    repository_id: number;
    slug: string;
    updated_at: string;
  };
  comments: number;
  /**
   * @format date-time
   */
  created_at: string;
  html_url: string;
  id: number;
  locked: boolean;
  node_id: string;
  number: number;
  reactions?: {
    "+1": number;
    "-1": number;
    confused: number;
    eyes: number;
    heart: number;
    hooray: number;
    laugh: number;
    rocket: number;
    total_count: number;
    /**
     * @format uri
     */
    url: string;
  };
  repository_url: string;
  /**
   * The current state of the discussion.
   * `converting` means that the discussion is being converted from an issue.
   * `transferring` means that the discussion is being transferred from another repository.
   */
  state: "open" | "closed" | "locked" | "converting" | "transferring";
  /**
   * The reason for the current state
   * @example "resolved"
   */
  state_reason: "resolved" | "outdated" | "duplicate" | "reopened";
  timeline_url?: string;
  title: string;
  /**
   * @format date-time
   */
  updated_at: string;
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
    id: number;
    login: string;
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
  labels?: Array<label>;
};
