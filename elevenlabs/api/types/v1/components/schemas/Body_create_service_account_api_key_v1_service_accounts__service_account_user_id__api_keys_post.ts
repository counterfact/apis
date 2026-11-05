import type { PermissionType } from "./PermissionType.js";
export type Body_create_service_account_api_key_v1_service_accounts__service_account_user_id__api_keys_post =
  {
    name: string;
    /**
     * The permissions of the XI API.
     */
    permissions: Array<PermissionType> | "all";
    /**
     * The character limit of the XI API key. If provided this will limit the usage of this api key to n characters per month where n is the chosen value. Requests that incur charges will fail after reaching this monthly limit.
     */
    character_limit?: number | null;
    /**
     * List of IP addresses or CIDR ranges allowed to use this API key. Each entry may be a CIDR range (e.g. '10.0.0.0/24') or a bare IP address (normalized to /32 or /128). On create, omit or pass null to allow all IPs. On update, omit to leave the allowlist unchanged, or pass "clear" to remove it.
     */
    allowed_ips?: Array<string> | null;
    /**
     * Whether the holder of this key may disable it via the self-disable endpoint. On create, omit or pass null to use the workspace's default (enabled for non-Enterprise plans, disabled for Enterprise plans). On update, omit to leave it unchanged, or pass "clear" to reset it to the workspace default. Only honored for workspaces with self-disable access enabled.
     */
    third_party_disable_allowed?: boolean | null;
    /**
     * Maximum concurrent text-to-speech/speech-to-speech requests for this API key. Only available for enterprise customers.
     */
    tts_concurrency_limit?: number | null;
    /**
     * Maximum concurrent dubbing requests for this API key. Only available for enterprise customers.
     */
    dubbing_concurrency_limit?: number | null;
    /**
     * Maximum concurrent music generation requests for this API key. Only available for enterprise customers.
     */
    music_concurrency_limit?: number | null;
    /**
     * Unix timestamp (in seconds) after which this API key stops working. When set, it must be at least 15 minutes and at most 90 days in the future. On create, omit or pass null for a key that never expires. On update, omit to leave it unchanged, or pass "clear" to remove the expiry (never expires). A workspace may disallow never-expiring keys, or allow them only on service account API keys; creating one or clearing an expiry then fails.
     */
    expires_at_unix?: number | null;
  };
