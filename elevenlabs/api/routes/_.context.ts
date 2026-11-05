import type { VoiceResponseModel } from "../types/v1/components/schemas/VoiceResponseModel.js";
import type { VoiceSettingsResponseModel } from "../types/v1/components/schemas/VoiceSettingsResponseModel.js";
import type { GetVoicesV2ResponseModel } from "../types/v2/components/schemas/GetVoicesV2ResponseModel.js";
import type { HTTP_GET_Query } from "../types/v2/paths/voices.types.js";
import type { ModelResponseModel } from "../types/v1/components/schemas/ModelResponseModel.js";
import type { UserResponseModel } from "../types/v1/components/schemas/UserResponseModel.js";
import type { ExtendedSubscriptionResponseModel } from "../types/v1/components/schemas/ExtendedSubscriptionResponseModel.js";

type VoiceListResult =
  | { page: GetVoicesV2ResponseModel; error?: never }
  | { page?: never; error: string };

export const defaultSettings = (): VoiceSettingsResponseModel => ({
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0,
  use_speaker_boost: true,
  speed: 1,
});

export class VoiceTransferError extends Error {
  override name = "VoiceTransferError";
  constructor(public status: number, public code: string) { super(code); }
}
const transferFail = (status: number, code: string): never => { throw new VoiceTransferError(status, code); };
const transferObject = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value);
const transferText = (value: unknown): value is string => typeof value === "string" && !!value.trim();
export class Context {
  voiceReplicas = new Map<string, Map<string, VoiceResponseModel>>();
  replicationTargets = new Map<string, { billingGroup: string; residency: string; canWrite: boolean }>();
  replicationPolicy?: { central: boolean; sourceWrite: boolean; serviceAccount: boolean; billingGroup: string; residency: string; categories: string[] };
  transferDefaults?: { time: number; settings: VoiceSettingsResponseModel };
  nextReplica = 0;

  importSharedVoice(owner: string, id: string, input: unknown) {
    if (!transferObject(input) || Object.keys(input).some(k => !["new_name", "bookmarked"].includes(k)) || !transferText(input.new_name) || input.new_name.length > 255 || input.bookmarked !== undefined && typeof input.bookmarked !== "boolean")
      return transferFail(400, "unsupported_shared_voice_options");
    const source = this.voiceLibrary?.records.get(id)?.value;
    if (!source || source.public_owner_id !== owner) return transferFail(404, "shared_voice_not_found");
    if (this.voices.has(id)) return transferFail(409, "voice_already_exists");
    if (this.voices.size >= this.getSubscription().voice_limit) return transferFail(409, "voice_limit_exceeded");
    if (!this.transferDefaults) throw new Error("Run startup or reset");
    const voice: VoiceResponseModel = {
      voice_id: id, name: input.new_name, description: source.description,
      category: source.category, labels: {language: source.language ?? "", accent: source.accent, gender: source.gender, age: source.age, use_case: source.use_case},
      verified_languages: structuredClone(source.verified_languages), samples: [],
      settings: structuredClone(this.transferDefaults.settings), available_for_tiers: [],
      high_quality_base_model_ids: [], is_owner: false, is_legacy: false,
      created_at_unix: this.transferDefaults.time, preview_url: null, is_bookmarked: input.bookmarked ?? true,
    };
    this.voices.set(id, voice);
    return {voice_id: id};
  }

  replicateVoice(id: string, input: unknown) {
    if (!transferObject(input) || Object.keys(input).some(k => !["target_workspace_id", "preserve_voice_id"].includes(k)) || !transferText(input.target_workspace_id) || input.preserve_voice_id !== undefined && typeof input.preserve_voice_id !== "boolean")
      return transferFail(400, "invalid_replication_options");
    const source = this.voices.get(id);
    if (!source) return transferFail(404, "voice_not_found");
    const policy = this.replicationPolicy;
    if (!policy) throw new Error("Run startup or reset");
    const target = this.replicationTargets.get(input.target_workspace_id);
    if (!target) return transferFail(404, "target_workspace_not_found");
    if (!policy.central || !policy.sourceWrite || source.is_owner !== true || target.billingGroup !== policy.billingGroup || !policy.serviceAccount && !target.canWrite)
      return transferFail(403, "voice_replication_forbidden");
    if (target.residency === policy.residency || !policy.categories.includes(source.category)) return transferFail(400, "voice_replication_unsupported");
    if (this.voiceSamples?.training.get(id)?.status === "queued") return transferFail(409, "voice_training_pending");
    const existing = this.voiceReplicas.get(input.target_workspace_id);
    let next = this.nextReplica, replicaId = id;
    if (input.preserve_voice_id === false) do { replicaId = `sim-replicated-voice-${++next}`; } while (existing?.has(replicaId));
    if (existing?.has(replicaId)) return transferFail(409, "target_voice_already_exists");
    const snapshot = structuredClone(source); snapshot.voice_id = replicaId;
    const records = existing ?? new Map<string, VoiceResponseModel>();
    records.set(replicaId, snapshot); this.voiceReplicas.set(input.target_workspace_id, records); this.nextReplica = next;
    return {voice_id: replicaId};
  }

  voiceSamples?: import("./voices/pvc/_.context.js").Context;
  voiceLibrary?: import("./shared-voices/_.context.js").Context;
  voices = new Map<string, VoiceResponseModel>();
  models = new Map<string, ModelResponseModel>();
  account?: {
    profile: Omit<UserResponseModel, "subscription">;
    subscription: ExtendedSubscriptionResponseModel;
  };

  getSubscription(): ExtendedSubscriptionResponseModel {
    if (!this.account) throw new Error("Account state is not initialized; run startup or reset");
    return {
      ...structuredClone(this.account.subscription),
      // Local convention: every voice in this simulator occupies one slot.
      voice_slots_used: this.voices.size,
    };
  }

  getUser(): UserResponseModel {
    const {
      open_invoices, has_open_invoices, next_invoice, pending_change,
      has_used_starter_coupon_on_account, has_used_creator_coupon_on_account,
      is_eligible_for_starter_promo, ...subscription
    } = this.getSubscription();
    return { ...structuredClone(this.account!.profile), subscription };
  }

  listModels() {
    return structuredClone([...this.models.values()]);
  }

  listVoices() {
    return structuredClone([...this.voices.values()]);
  }

  listVoicesV2(query: HTTP_GET_Query): VoiceListResult {
    const supported = new Set([
      "page_size",
      "next_page_token",
      "search",
      "category",
      "sort",
      "sort_direction",
      "include_total_count",
      "gender",
      "age",
      "accent",
      "language",
      "use_cases",
      "voice_ids",
      "collection_id",
    ]);
    for (const [key, value] of Object.entries(query)) {
      if (value !== null && value !== undefined && !supported.has(key)) {
        return { error: `The simulator does not support the '${key}' filter` };
      }
    }
    if (query.voice_ids && query.voice_ids.length > 100) {
      return { error: "voice_ids must contain at most 100 IDs" };
    }
    const size = query.page_size ?? 10;
    const token = query.next_page_token ?? "0";
    const offset = Number(token);
    if (!Number.isInteger(size) || size < 1 || size > 100) {
      return { error: "page_size must be an integer from 1 to 100" };
    }
    if (!/^(0|[1-9]\d*)$/.test(token) || !Number.isSafeInteger(offset)) {
      return { error: "next_page_token must be a nonnegative integer offset" };
    }
    if (query.sort && !["name", "created_at_unix"].includes(query.sort)) {
      return { error: "sort must be name or created_at_unix" };
    }
    if (
      query.sort_direction &&
      !["asc", "desc"].includes(query.sort_direction)
    ) {
      return { error: "sort_direction must be asc or desc" };
    }
    const search = query.search?.toLowerCase();
    let voices = this.listVoices().filter(
      (voice) =>
        (!query.category || voice.category === query.category) &&
        (query.collection_id == null || (voice.collection_ids ?? []).includes(query.collection_id)) &&
        (query.gender == null || voice.labels.gender === query.gender) &&
        (query.age == null || voice.labels.age === query.age) &&
        (query.accent == null || voice.labels.accent === query.accent) &&
        (query.language == null ||
          query.language.includes(voice.labels.language)) &&
        (query.use_cases == null ||
          query.use_cases.includes(voice.labels.use_case)) &&
        (query.voice_ids == null || query.voice_ids.includes(voice.voice_id)) &&
        (!search ||
          [
            voice.name,
            voice.description ?? "",
            voice.category,
            ...Object.values(voice.labels),
          ]
            .join(" ")
            .toLowerCase()
            .includes(search)),
    );
    if (query.sort) {
      const direction = query.sort_direction === "desc" ? -1 : 1;
      voices.sort(
        (a, b) =>
          direction *
          (query.sort === "name"
            ? a.name.localeCompare(b.name)
            : (a.created_at_unix ?? 0) - (b.created_at_unix ?? 0)),
      );
    }
    const page = voices.slice(offset, offset + size);
    const hasMore = offset + page.length < voices.length;
    return {
      page: {
        voices: page,
        has_more: hasMore,
        total_count: voices.length,
        next_page_token: hasMore ? String(offset + page.length) : null,
      },
    };
  }

  getVoice(id: string) {
    const voice = this.voices.get(id);
    return voice ? structuredClone(voice) : undefined;
  }

  editSettings(id: string, settings: VoiceSettingsResponseModel) {
    const voice = this.voices.get(id);
    if (!voice) return false;
    // Omitted and null values leave the current setting unchanged.
    const patch = Object.fromEntries(
      Object.entries(settings).filter(
        ([, value]) => value !== null && value !== undefined,
      ),
    );
    voice.settings = { ...voice.settings, ...patch };
    return true;
  }

  deleteVoice(id: string) {
    this.voiceSamples?.purgeVoice(id);
    return this.voices.delete(id);
  }
}
