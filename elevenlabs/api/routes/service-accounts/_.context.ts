import { createHash } from "node:crypto";
import { isIP } from "node:net";
import type { WorkspaceApiKeyResponseModel as Key } from "../../types/v1/components/schemas/WorkspaceApiKeyResponseModel.js";
import type { WorkspaceGroupResponseModel as Group } from "../../types/v1/components/schemas/WorkspaceGroupResponseModel.js";
import type { DefaultSharingGroupConfig as Sharing } from "../../types/v1/components/schemas/DefaultSharingGroupConfig.js";
import type { PermissionType } from "../../types/v1/components/schemas/PermissionType.js";

type Account = { id: string; name: string; createdAt: number; sharing: Sharing[]; keys: Map<string, Key> };
const object = (input: unknown): input is Record<string, unknown> => input !== null && typeof input === "object" && !Array.isArray(input);
const name = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const numeric = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
const concurrency = { tts_concurrency_limit: "concurrency", dubbing_concurrency_limit: "dubbing_concurrency", music_concurrency_limit: "music_concurrency" } as const;
const permissionNames = new Set<string>([
  "text_to_speech", "speech_to_speech", "speech_to_text", "models_read", "models_write", "voices_read", "voices_write", "voice_collections_read", "voice_collections_write", "speech_history_read", "speech_history_write", "sound_generation", "audio_isolation", "voice_generation", "dubbing_read", "dubbing_write", "pronunciation_dictionaries_read", "pronunciation_dictionaries_write", "user_read", "user_write", "projects_read", "projects_write", "audio_native_read", "audio_native_write", "workspace_read", "workspace_write", "forced_alignment", "convai_read", "convai_write", "agents_architect", "music_generation", "image_video_generation", "flows", "templates", "add_voice_from_voice_library", "create_instant_voice_clone", "create_professional_voice_clone", "publish_voice_to_voice_library", "share_voice_externally", "create_user_api_key", "workspace_analytics_full_read", "webhooks_write", "service_account_write", "group_members_manage", "workspace_members_read", "workspace_members_invite", "workspace_members_remove", "terms_of_service_accept", "audit_log_read", "conversation_privacy_manage", "copy_resources_cross_workspace", "synthid_detector",
]);
export class ServiceAccountError extends Error {
  override name = "ServiceAccountError";
  constructor(public status: number, public code: string, message: string) { super(message); }
}
const invalid = (): never => { throw new ServiceAccountError(400, "invalid_service_account_configuration", "Invalid service account or API key configuration"); };

function allowedIps(value: unknown): string[] {
  if (!Array.isArray(value) || value.length < 1 || value.length > 100) return invalid();
  return value.map((entry) => {
    if (typeof entry !== "string") return invalid();
    const [ip, prefix, extra] = entry.split("/");
    const family = isIP(ip);
    if (!family || extra !== undefined) return invalid();
    const bits = family === 4 ? 32 : 128;
    if (prefix !== undefined && (!/^\d+$/.test(prefix) || Number(prefix) > bits)) return invalid();
    return `${ip}/${prefix ?? bits}`;
  });
}

export class Context {
  accounts = new Map<string, Account>();
  nextAccountNumber = 0;
  nextKeyNumber = 0;
  nowUnix = 0;
  getGroups: () => Map<string, Group> = () => new Map();

  private account(id: string) {
    const account = this.accounts.get(id);
    if (!account) throw new ServiceAccountError(404, "service_account_not_found", "Service account not found");
    return account;
  }
  private key(accountId: string, id: string) {
    const account = this.account(accountId);
    const key = account.keys.get(id);
    if (!key) throw new ServiceAccountError(404, "api_key_not_found", "Service account API key not found");
    return { account, key };
  }
  listAccounts() {
    return { "service-accounts": [...this.accounts.values()].map((account) => ({
      service_account_user_id: account.id, name: account.name, created_at_unix: account.createdAt,
      "api-keys": structuredClone([...account.keys.values()]),
      default_sharing_groups: account.sharing.flatMap((sharing) => {
        const group = this.getGroups().get(sharing.group_id);
        return group ? [{ group: structuredClone(group), permission_level: sharing.permission_level }] : [];
      }),
    })) };
  }
  createAccount(input: unknown) {
    if (!object(input) || !name(input.name) || Object.keys(input).some((key) => !["name", "default_sharing_groups"].includes(key))) return invalid();
    const sharing = input.default_sharing_groups ?? [];
    if (!Array.isArray(sharing)) return invalid();
    const groups = this.getGroups();
    const seen = new Set<string>();
    for (const config of sharing) {
      if (!object(config) || typeof config.group_id !== "string" || !groups.has(config.group_id) ||
        !["admin", "editor", "viewer"].includes(String(config.permission_level)) ||
        Object.keys(config).some((key) => !["group_id", "permission_level"].includes(key)) || seen.has(config.group_id)) return invalid();
      seen.add(config.group_id);
    }
    if (this.accounts.size >= 20) throw new ServiceAccountError(409, "service_account_limit", "Simulator service account limit reached");
    let id: string;
    do { id = `sim-service-account-created-${++this.nextAccountNumber}`; } while (this.accounts.has(id));
    this.accounts.set(id, { id, name: input.name, sharing: structuredClone(sharing) as Sharing[], createdAt: this.nowUnix, keys: new Map() });
    return { "service-account-user-id": id };
  }
  listKeys(accountId: string) { return { "api-keys": structuredClone([...this.account(accountId).keys.values()]) }; }

  private validateKey(input: unknown, creating: boolean) {
    if (input === undefined && !creating) return {};
    if (!object(input)) return invalid();
    const fields = ["name", "permissions", "character_limit", "allowed_ips", "third_party_disable_allowed", "expires_at_unix", ...Object.keys(concurrency), ...(!creating ? ["is_enabled"] : [])];
    if (Object.keys(input).some((key) => !fields.includes(key))) return invalid();
    if (creating && (!name(input.name) || input.permissions === undefined)) return invalid();
    for (const [field, value] of Object.entries(input)) {
      if (!creating && value === "no_update" && field !== "name") continue;
      if (field === "name") { if ((!creating && value === null) || name(value)) continue; return invalid(); }
      if (field === "permissions") {
        if (value === "all" || (Array.isArray(value) && value.every((permission) => typeof permission === "string" && permissionNames.has(permission)))) continue;
        return invalid();
      }
      if (value === "clear" && !creating && field !== "is_enabled") continue;
      if (value === null && (creating || ["character_limit", ...Object.keys(concurrency)].includes(field))) continue;
      if (field === "allowed_ips") { allowedIps(value); continue; }
      if (["is_enabled", "third_party_disable_allowed"].includes(field)) { if (typeof value === "boolean") continue; return invalid(); }
      if (!numeric(value)) return invalid();
      if (field === "expires_at_unix" && (value < this.nowUnix + 900 || value > this.nowUnix + 90 * 86_400)) return invalid();
    }
    return input;
  }
  private applyKey(key: Key, input: Record<string, unknown>) {
    for (const [field, value] of Object.entries(input)) {
      if (value === undefined || value === "no_update" || (value === null && field !== "expires_at_unix")) continue;
      if (field === "name") key.name = value as string;
      else if (field === "permissions") key.permissions = value === "all" ? null : structuredClone(value) as PermissionType[];
      else if (field === "is_enabled") { key.is_disabled = !value; key.disable_reason = value ? null : "self_disabled"; }
      else if (field === "allowed_ips") key.allowed_ips = value === "clear" ? null : allowedIps(value);
      else if (field === "third_party_disable_allowed") key.third_party_disable_allowed = value === "clear" ? true : value as boolean;
      else if (Object.hasOwn(concurrency, field)) {
        const platform = concurrency[field as keyof typeof concurrency];
        key.platform_limits ??= {};
        key.platform_limits[platform] = { limit: value === "clear" ? null : value as number };
      } else if (field === "character_limit") key.character_limit = value === "clear" ? null : value as number;
      else if (field === "expires_at_unix") key.expires_at_unix = value === "clear" ? null : value as number | null;
    }
    return key;
  }
  createKey(accountId: string, input: unknown) {
    const account = this.account(accountId);
    const validated = this.validateKey(input, true);
    let id: string;
    do { id = `sim-service-key-created-${++this.nextKeyNumber}`; } while ([...this.accounts.values()].some((value) => value.keys.has(id)));
    const token = `sim-not-a-real-key-${id}`;
    const key = this.applyKey({ name: validated.name as string, key_id: id, hint: `...${id.slice(-6)}`, service_account_user_id: accountId,
      created_at_unix: this.nowUnix, hashed_xi_api_key: createHash("sha256").update(token).digest("hex"),
      is_disabled: false, disable_reason: null, character_count: 0, character_limit: null, permissions: null,
      allowed_ips: null, third_party_disable_allowed: true, platform_limits: null, expires_at_unix: null,
    }, validated);
    account.keys.set(id, key);
    return { "xi-api-key": token, key_id: id };
  }
  updateKey(accountId: string, id: string, input: unknown) {
    const { account, key } = this.key(accountId, id);
    const validated = this.validateKey(input, false);
    account.keys.set(id, this.applyKey(structuredClone(key), validated));
    return {};
  }
  disableKey(accountId: string, id: string) {
    const { key } = this.key(accountId, id);
    key.is_disabled = true;
    key.disable_reason = "self_disabled";
    return {};
  }
  deleteKey(accountId: string, id: string) {
    const { account } = this.key(accountId, id);
    account.keys.delete(id);
    return {};
  }
}
