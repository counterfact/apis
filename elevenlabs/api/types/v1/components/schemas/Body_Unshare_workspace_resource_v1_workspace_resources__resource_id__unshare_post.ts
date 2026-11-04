import type { WorkspaceResourceType } from "./WorkspaceResourceType.js";
export type Body_Unshare_workspace_resource_v1_workspace_resources__resource_id__unshare_post =
  {
    /**
     * Resource type of the target resource.
     */
    resource_type: WorkspaceResourceType;
    /**
     * The email of the user or service account.
     */
    user_email?: string | null;
    /**
     * The ID of the target group. Use 'default' to set the resource's baseline role — every workspace member receives this role unless they hold a higher one through a direct user grant, group membership, or workspace (service account) API key.
     */
    group_id?: string | null;
    /**
     * The ID of the target workspace (service account) API key. This is not the API key string itself that you pass in the header for authentication — it is the key's ID, which workspace admins can find under Developers → Service Accounts.
     */
    workspace_api_key_id?: string | null;
  };
