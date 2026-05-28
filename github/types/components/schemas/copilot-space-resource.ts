/**
 * A resource attached to a Copilot Space.
 */
export type copilot_space_resource = {
  /**
   * The unique identifier of the resource.
   */
  id: number;
  /**
   * The type of the resource.
   */
  resource_type:
    | "repository"
    | "github_file"
    | "free_text"
    | "github_issue"
    | "github_pull_request"
    | "media_content"
    | "uploaded_text_file";
  /**
   * The ID of the associated chat attachment, if any.
   */
  copilot_chat_attachment_id?: number;
  /**
   * Resource-specific metadata. The keys and values depend on the resource type.
   */
  metadata: { [key: string]: unknown };
  /**
   * The date and time the resource was created.
   * @format date-time
   */
  created_at: string;
  /**
   * The date and time the resource was last updated.
   * @format date-time
   */
  updated_at: string;
};
