import type { link_with_type } from "./link-with-type.js";

/**
 * Feed
 */
export type feed = {
  /**
   * @example "https://github.com/timeline"
   */
  timeline_url: string;
  /**
   * @example "https://github.com/{user}"
   */
  user_url: string;
  /**
   * @example "https://github.com/octocat"
   */
  current_user_public_url?: string;
  /**
   * @example "https://github.com/octocat.private?token=abc123"
   */
  current_user_url?: string;
  /**
   * @example "https://github.com/octocat.private.actor?token=abc123"
   */
  current_user_actor_url?: string;
  /**
   * @example "https://github.com/octocat-org"
   */
  current_user_organization_url?: string;
  /**
   * @example ["https://github.com/organizations/github/octocat.private.atom?token=abc123"]
   */
  current_user_organization_urls?: Array<string>;
  /**
   * @example "https://github.com/security-advisories"
   */
  security_advisories_url?: string;
  /**
   * A feed of discussions for a given repository.
   * @example "https://github.com/{user}/{repo}/discussions"
   */
  repository_discussions_url?: string;
  /**
   * A feed of discussions for a given repository and category.
   * @example "https://github.com/{user}/{repo}/discussions/categories/{category}"
   */
  repository_discussions_category_url?: string;
  _links: {
    timeline: link_with_type;
    user: link_with_type;
    security_advisories?: link_with_type;
    current_user?: link_with_type;
    current_user_public?: link_with_type;
    current_user_actor?: link_with_type;
    current_user_organization?: link_with_type;
    current_user_organizations?: Array<link_with_type>;
    repository_discussions?: link_with_type;
    repository_discussions_category?: link_with_type;
  };
};
