import type { nullable_simple_user } from "./nullable-simple-user.js";
import type { repository } from "./repository.js";

/**
 * A migration.
 */
export type migration = {
  /**
   * @format int64
   * @example 79
   */
  id: number;
  owner: nullable_simple_user;
  /**
   * @example "0b989ba4-242f-11e5-81e1-c7b6966d2516"
   */
  guid: string;
  /**
   * @example "pending"
   */
  state: string;
  /**
   * @example true
   */
  lock_repositories: boolean;
  exclude_metadata: boolean;
  exclude_git_data: boolean;
  exclude_attachments: boolean;
  exclude_releases: boolean;
  exclude_owner_projects: boolean;
  org_metadata_only: boolean;
  /**
   * The repositories included in the migration. Only returned for export migrations.
   */
  repositories: Array<repository>;
  /**
   * @format uri
   * @example "https://api.github.com/orgs/octo-org/migrations/79"
   */
  url: string;
  /**
   * @format date-time
   * @example "2015-07-06T15:33:38-07:00"
   */
  created_at: string;
  /**
   * @format date-time
   * @example "2015-07-06T15:33:38-07:00"
   */
  updated_at: string;
  node_id: string;
  /**
   * @format uri
   */
  archive_url?: string;
  /**
   * Exclude related items from being returned in the response in order to improve performance of the request. The array can include any of: `"repositories"`.
   */
  exclude?: Array<string>;
};
