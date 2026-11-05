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

export class Context {
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
    return this.voices.delete(id);
  }
}
