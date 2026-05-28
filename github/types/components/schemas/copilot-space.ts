import type { simple_user } from "./simple-user.js";
import type { organization_simple } from "./organization-simple.js";

/**
 * A GitHub Copilot Space represents an interactive AI workspace where users can ask questions and get assistance.
 */
export type copilot_space = {
  /**
   * The unique identifier of the space.
   * @format int64
   * @example 42
   */
  id: number;
  /**
   * The number that identifies the space within its owner.
   * @example 1
   */
  number: number;
  /**
   * The display name of the space.
   * @example "My Development Space"
   */
  name: string;
  /**
   * A description of the space.
   * @example "A space for discussing React development patterns"
   */
  description?: string;
  /**
   * General instructions for the Copilot Space.
   * @example "Help with React development patterns and best practices"
   */
  general_instructions?: string;
  /**
   * The base role that determines default permissions.
   * - `no_access`: No default access
   * - `reader`: Default read permissions
   * - `writer`: Default write permissions (organization spaces only)
   * - `admin`: Default admin permissions (organization spaces only)
   * @example "no_access"
   */
  base_role: "reader" | "writer" | "admin" | "no_access";
  /**
   * The user or organization that owns this space.
   */
  owner: simple_user | organization_simple;
  creator: simple_user;
  /**
   * The date and time the space was created.
   * @format date-time
   * @example "2023-01-01T00:00:00Z"
   */
  created_at: string;
  /**
   * The date and time the space was last updated.
   * @format date-time
   * @example "2023-01-01T12:00:00Z"
   */
  updated_at: string;
  /**
   * The HTML URL of the space.
   * @format uri
   * @example "https://github.com/copilot/spaces/octo-org/5"
   */
  html_url: string;
  /**
   * The API URL of the space.
   * @format uri
   * @example "https://api.github.com/organizations/1/copilot-spaces/5"
   */
  api_url: string;
  /**
   * Resources attached to the space.
   */
  resources_attributes?: Array<{
    /**
     * The unique identifier of the resource.
     * @format int64
     */
    id?: number;
    /**
     * The type of resource.
     */
    resource_type?:
      | "repository"
      | "github_file"
      | "free_text"
      | "github_issue"
      | "github_pull_request"
      | "media_content"
      | "uploaded_text_file";
    /**
     * The unique identifier of the chat attachment for uploaded files or media content.
     * @format int64
     */
    copilot_chat_attachment_id?: number;
    /**
     * The date and time the resource was created.
     * @format date-time
     */
    created_at?: string;
    /**
     * The date and time the resource was last updated.
     * @format date-time
     */
    updated_at?: string;
    /**
     * Metadata specific to the resource type.
     */
    metadata?: {
      /**
       * Repository ID for repository or file resources.
       */
      repository_id?: number;
      /**
       * File path for file resources.
       */
      file_path?: string;
      /**
       * Text content for free text resources.
       */
      text?: string;
      /**
       * Name for the resource.
       */
      name?: string;
      /**
       * Issue or PR number.
       */
      number?: number;
      /**
       * Chat attachment ID for uploaded files or media.
       */
      copilot_chat_attachment_id?: number;
      /**
       * Media type for media content resources.
       */
      media_type?: string;
      /**
       * URL for media content resources.
       */
      url?: string;
      /**
       * Height for media content resources.
       */
      height?: number;
      /**
       * Width for media content resources.
       */
      width?: number;
    };
  }>;
};
