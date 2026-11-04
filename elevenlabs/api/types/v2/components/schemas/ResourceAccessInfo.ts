/**
 * @example {"access_source":"creator","creator_email":"john.doe@example.com","creator_name":"John Doe","is_creator":true,"role":"admin"}
 */
export type ResourceAccessInfo = {
  /**
   * Whether the user making the request is the creator of the agent
   */
  is_creator: boolean;
  /**
   * Name of the agent's creator
   */
  creator_name: string;
  /**
   * Email of the agent's creator
   */
  creator_email: string;
  /**
   * The role of the user making the request
   */
  role: "admin" | "editor" | "commenter" | "viewer";
  /**
   * The access level for anonymous users. If None, the resource is not shared publicly.
   */
  anonymous_access_level_override?:
    ("admin" | "editor" | "commenter" | "viewer") | null;
  /**
   * Why the requesting user has access to this resource. 'creator' = caller is the owner. 'explicit' = caller (or one of their workspace groups) is listed in role_to_group_ids beyond the workspace-wide everyone group. 'workspace_default' = the workspace-wide everyone group is listed in role_to_group_ids (every non-anon workspace member, including admins, sees this resource). 'workspace_admin' = caller is a workspace admin and the admin seat is the *only* path to access; reserved for docs nobody else can see. Lets the UI disclose why an admin-bypass viewer sees a doc that wasn't explicitly shared with them.
   */
  access_source?:
    ("creator" | "explicit" | "workspace_admin" | "workspace_default") | null;
};
