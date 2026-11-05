import type { WorkspaceGroupPermission } from "./WorkspaceGroupPermission.js";
import type { ScimGroupResponseModel } from "./ScimGroupResponseModel.js";
export type WorkspaceGroupResponseModel = {
  name: string;
  id: string;
  members: Array<string>;
  permissions: Array<WorkspaceGroupPermission> | null;
  group_usage_limit?: number | "unlimited" | null;
  group_pvc_limit?: number | "unlimited" | null;
  group_concurrency_limit?: number | "unlimited" | null;
  group_dubbing_concurrency_limit?: number | "unlimited" | null;
  group_music_concurrency_limit?: number | "unlimited" | null;
  character_count?: number | null;
  /**
   * @default false
   */
  is_scim_synced?: boolean;
  scim_group?: ScimGroupResponseModel | null;
  /**
   * @default false
   */
  scim_frozen?: boolean;
};
