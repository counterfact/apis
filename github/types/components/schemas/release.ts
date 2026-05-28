import type { simple_user } from "./simple-user.js";
import type { release_asset } from "./release-asset.js";
import type { reaction_rollup } from "./reaction-rollup.js";

/**
 * A release.
 */
export type release = {
  /**
   * @format uri
   */
  url: string;
  /**
   * @format uri
   */
  html_url: string;
  /**
   * @format uri
   */
  assets_url: string;
  upload_url: string;
  /**
   * @format uri
   */
  tarball_url: string;
  /**
   * @format uri
   */
  zipball_url: string;
  id: number;
  node_id: string;
  /**
   * The name of the tag.
   * @example "v1.0.0"
   */
  tag_name: string;
  /**
   * Specifies the commitish value that determines where the Git tag is created from.
   * @example "master"
   */
  target_commitish: string;
  name: string;
  body?: string;
  /**
   * true to create a draft (unpublished) release, false to create a published one.
   * @example false
   */
  draft: boolean;
  /**
   * Whether to identify the release as a prerelease or a full release.
   * @example false
   */
  prerelease: boolean;
  /**
   * Whether or not the release is immutable.
   * @example false
   */
  immutable?: boolean;
  /**
   * @format date-time
   */
  created_at: string;
  /**
   * @format date-time
   */
  published_at: string;
  /**
   * @format date-time
   */
  updated_at?: string;
  author: simple_user;
  assets: Array<release_asset>;
  body_html?: string;
  body_text?: string;
  mentions_count?: number;
  /**
   * The URL of the release discussion.
   * @format uri
   */
  discussion_url?: string;
  reactions?: reaction_rollup;
};
