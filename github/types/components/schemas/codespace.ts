import type { simple_user } from "./simple-user.js";
import type { minimal_repository } from "./minimal-repository.js";
import type { nullable_codespace_machine } from "./nullable-codespace-machine.js";

/**
 * A codespace.
 */
export type codespace = {
  /**
   * @format int64
   * @example 1
   */
  id: number;
  /**
   * Automatically generated name of this codespace.
   * @example "monalisa-octocat-hello-world-g4wpq6h95q"
   */
  name: string;
  /**
   * Display name for this codespace.
   * @example "bookish space pancake"
   */
  display_name?: string;
  /**
   * UUID identifying this codespace's environment.
   * @example "26a7c758-7299-4a73-b978-5a92a7ae98a0"
   */
  environment_id: string;
  owner: simple_user;
  billable_owner: simple_user;
  repository: minimal_repository;
  machine: nullable_codespace_machine;
  /**
   * Path to devcontainer.json from repo root used to create Codespace.
   * @example ".devcontainer/example/devcontainer.json"
   */
  devcontainer_path?: string;
  /**
   * Whether the codespace was created from a prebuild.
   * @example false
   */
  prebuild: boolean;
  /**
   * @format date-time
   * @example "2011-01-26T19:01:12Z"
   */
  created_at: string;
  /**
   * @format date-time
   * @example "2011-01-26T19:01:12Z"
   */
  updated_at: string;
  /**
   * Last known time this codespace was started.
   * @format date-time
   * @example "2011-01-26T19:01:12Z"
   */
  last_used_at: string;
  /**
   * State of this codespace.
   * @example "Available"
   */
  state:
    | "Unknown"
    | "Created"
    | "Queued"
    | "Provisioning"
    | "Available"
    | "Awaiting"
    | "Unavailable"
    | "Deleted"
    | "Moved"
    | "Shutdown"
    | "Archived"
    | "Starting"
    | "ShuttingDown"
    | "Failed"
    | "Exporting"
    | "Updating"
    | "Rebuilding";
  /**
   * API URL for this codespace.
   * @format uri
   */
  url: string;
  /**
   * Details about the codespace's git repository.
   */
  git_status: {
    /**
     * The number of commits the local repository is ahead of the remote.
     * @example 0
     */
    ahead?: number;
    /**
     * The number of commits the local repository is behind the remote.
     * @example 0
     */
    behind?: number;
    /**
     * Whether the local repository has unpushed changes.
     */
    has_unpushed_changes?: boolean;
    /**
     * Whether the local repository has uncommitted changes.
     */
    has_uncommitted_changes?: boolean;
    /**
     * The current branch (or SHA if in detached HEAD state) of the local repository.
     * @example "main"
     */
    ref?: string;
  };
  /**
   * The initally assigned location of a new codespace.
   * @example "WestUs2"
   */
  location: "EastUs" | "SouthEastAsia" | "WestEurope" | "WestUs2";
  /**
   * The number of minutes of inactivity after which this codespace will be automatically stopped.
   * @example 60
   */
  idle_timeout_minutes: number;
  /**
   * URL to access this codespace on the web.
   * @format uri
   */
  web_url: string;
  /**
   * API URL to access available alternate machine types for this codespace.
   * @format uri
   */
  machines_url: string;
  /**
   * API URL to start this codespace.
   * @format uri
   */
  start_url: string;
  /**
   * API URL to stop this codespace.
   * @format uri
   */
  stop_url: string;
  /**
   * API URL to publish this codespace to a new repository.
   * @format uri
   */
  publish_url?: string;
  /**
   * API URL for the Pull Request associated with this codespace, if any.
   * @format uri
   */
  pulls_url: string;
  recent_folders: Array<string>;
  runtime_constraints?: {
    /**
     * The privacy settings a user can select from when forwarding a port.
     */
    allowed_port_privacy_settings?: Array<string>;
  };
  /**
   * Whether or not a codespace has a pending async operation. This would mean that the codespace is temporarily unavailable. The only thing that you can do with a codespace in this state is delete it.
   */
  pending_operation?: boolean;
  /**
   * Text to show user when codespace is disabled by a pending operation
   */
  pending_operation_disabled_reason?: string;
  /**
   * Text to show user when codespace idle timeout minutes has been overriden by an organization policy
   */
  idle_timeout_notice?: string;
  /**
   * Duration in minutes after codespace has gone idle in which it will be deleted. Must be integer minutes between 0 and 43200 (30 days).
   * @example 60
   */
  retention_period_minutes?: number;
  /**
   * When a codespace will be auto-deleted based on the "retention_period_minutes" and "last_used_at"
   * @format date-time
   * @example "2011-01-26T20:01:12Z"
   */
  retention_expires_at?: string;
  /**
   * The text to display to a user when a codespace has been stopped for a potentially actionable reason.
   * @example "you've used 100% of your spending limit for Codespaces"
   */
  last_known_stop_notice?: string;
};
