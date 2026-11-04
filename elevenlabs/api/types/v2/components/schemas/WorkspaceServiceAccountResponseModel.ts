import type { WorkspaceApiKeyResponseModel } from "./WorkspaceApiKeyResponseModel.js";
import type { DefaultSharingGroupResponseModel } from "./DefaultSharingGroupResponseModel.js";
export type WorkspaceServiceAccountResponseModel = {
  service_account_user_id: string;
  name: string;
  created_at_unix?: number | null;
  "api-keys": Array<WorkspaceApiKeyResponseModel>;
  /**
   * @default []
   */
  default_sharing_groups?: Array<DefaultSharingGroupResponseModel>;
};
