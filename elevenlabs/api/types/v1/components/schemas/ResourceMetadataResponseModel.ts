import type { WorkspaceResourceType } from "./WorkspaceResourceType.js";
import type { ShareOptionResponseModel } from "./ShareOptionResponseModel.js";
/**
 * @example {"anonymous_access_level_override":"viewer","creator_user_id":"5zavrE1kZXv2lFw9BKgEkf0B5Wqo","resource_id":"4ZUqyldxf71HqUbcP2Lc","resource_name":"My Custom Voice","resource_type":"voice","role_to_group_ids":{"admin":["5zavrE1kZXv2lFw9BKgEkf0B5Wqo"],"editor":["8ruQDGM2R4w1mFbHI5aROCUjIpJZ"],"role_01jd7yq2k8f0abcd1234wxyz":["9mQrTx4vNb2wKpLs6ZyE1cHgUdFa"],"viewer":[]},"share_options":[{"id":"i2YYI6huwBmcgYydAXARmQJc3pmX","name":"user@example.com","type":"user"},{"id":"x1AfvYKAmiqxCnbvZeNXHqqthJaC","name":"mygroup","type":"group"}]}
 */
export type ResourceMetadataResponseModel = {
  /**
   * The ID of the resource.
   */
  resource_id: string;
  /**
   * The name of the resource, if available.
   */
  resource_name: string | null;
  /**
   * The type of the resource.
   */
  resource_type: WorkspaceResourceType;
  /**
   * The ID of the user who created the resource.
   */
  creator_user_id: string | null;
  /**
   * The access level for anonymous users. If None, the resource is not shared publicly.
   */
  anonymous_access_level_override:
    ("admin" | "editor" | "commenter" | "viewer") | null;
  /**
   * A mapping of grant slots to group IDs. Keys are the preset access roles plus workspace custom-role ids ('role_...'). When the resource is shared with a user, the group id is the user's id.
   */
  role_to_group_ids: { [key: string]: Array<string> };
  /**
   * List of options for sharing the resource further in the workspace. These are users who don't have access to the resource yet.
   */
  share_options: Array<ShareOptionResponseModel>;
};
