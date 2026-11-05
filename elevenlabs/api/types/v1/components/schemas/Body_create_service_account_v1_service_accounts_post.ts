import type { DefaultSharingGroupConfig } from "./DefaultSharingGroupConfig.js";
export type Body_create_service_account_v1_service_accounts_post = {
  name: string;
  /**
   * List of groups with their permission levels to share with by default. Each entry should specify a group_id and a permission_level (admin, editor, or viewer).
   */
  default_sharing_groups?: Array<DefaultSharingGroupConfig> | null;
};
