import type { nullable_simple_user } from "./nullable-simple-user.js";
import type { nullable_minimal_repository } from "./nullable-minimal-repository.js";

/**
 * A software package
 */
export type package_ = {
  /**
   * Unique identifier of the package.
   * @example 1
   */
  id: number;
  /**
   * The name of the package.
   * @example "super-linter"
   */
  name: string;
  /**
   * @example "docker"
   */
  package_type: "npm" | "maven" | "rubygems" | "docker" | "nuget" | "container";
  /**
   * @example "https://api.github.com/orgs/github/packages/container/super-linter"
   */
  url: string;
  /**
   * @example "https://github.com/orgs/github/packages/container/package/super-linter"
   */
  html_url: string;
  /**
   * The number of versions of the package.
   * @example 1
   */
  version_count: number;
  /**
   * @example "private"
   */
  visibility: "private" | "public";
  owner?: nullable_simple_user;
  repository?: nullable_minimal_repository;
  /**
   * @format date-time
   */
  created_at: string;
  /**
   * @format date-time
   */
  updated_at: string;
};
