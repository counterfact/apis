import type { PermissionType } from "./PermissionType.js";
import type { LockReason } from "./LockReason.js";
import type { PlatformLimits } from "./PlatformLimits.js";
export type WorkspaceApiKeyResponseModel = {
  name: string;
  hint: string;
  key_id: string;
  service_account_user_id: string;
  created_at_unix?: number | null;
  /**
   * @default false
   */
  is_disabled?: boolean;
  permissions?: Array<PermissionType> | null;
  disable_reason?: LockReason | null;
  /**
   * Maximum number of credits allowed in the current billing period.
   */
  character_limit?: number | null;
  /**
   * Credits already used in the current billing period.
   */
  character_count?: number | null;
  hashed_xi_api_key: string;
  allowed_ips?: Array<string> | null;
  third_party_disable_allowed?: boolean | null;
  /**
   * Per-API-key concurrency limits (TTS/dubbing/music). Enterprise-only.
   */
  platform_limits?: PlatformLimits | null;
  /**
   * Unix timestamp (seconds) after which this API key stops working. Null means the key never expires.
   */
  expires_at_unix?: number | null;
};
