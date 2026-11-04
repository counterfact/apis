import type { StoredUsagePlatformLimit } from "./StoredUsagePlatformLimit.js";
import type { ComputedUsagePlatformLimit } from "./ComputedUsagePlatformLimit.js";
/**
 * Unified container for all platform limits.
 *
 * Can be used by:
 * - Billing groups (WorkspaceGroupDBModel.platform_limits)
 * - Child workspaces (SubscriptionDBModel.platform_limits)
 * - API keys (XiApiKeyMetadataDBModel.platform_limits)
 *
 * All fields are required when platform_limits exists. Use limit=None for unlimited.
 */
export type PlatformLimits = {
  /**
   * Credit usage limit (limit=None means unlimited)
   */
  credits?: StoredUsagePlatformLimit;
  /**
   * Professional Voice Clone count limit (limit=None means unlimited)
   */
  pvc?: ComputedUsagePlatformLimit;
  /**
   * TTS concurrency limit (limit=None means unlimited)
   */
  concurrency?: ComputedUsagePlatformLimit;
  /**
   * Dubbing concurrency limit (limit=None means unlimited)
   */
  dubbing_concurrency?: ComputedUsagePlatformLimit;
  /**
   * Music generation concurrency limit (limit=None means unlimited)
   */
  music_concurrency?: ComputedUsagePlatformLimit;
};
