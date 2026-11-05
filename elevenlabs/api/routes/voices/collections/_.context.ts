import type { VoiceResponseModel } from "../../../types/v1/components/schemas/VoiceResponseModel.js";
import type { UserVoiceCollectionResponseModel as Collection } from "../../../types/v1/components/schemas/UserVoiceCollectionResponseModel.js";
import type { Body_Create_voice_collection_v1_voices_collections_post as CreateCollection } from "../../../types/v1/components/schemas/Body_Create_voice_collection_v1_voices_collections_post.js";
import type { Body_Update_voice_collection_v1_voices_collections__collection_id__patch as UpdateCollection } from "../../../types/v1/components/schemas/Body_Update_voice_collection_v1_voices_collections__collection_id__patch.js";

type MembershipResult =
  | { value: { collection_id: string; voice_id: string }; error?: never }
  | { error: "collection_not_found" | "voice_not_found"; value?: never };

export class Context {
  collections = new Map<string, Collection>();
  nextCollectionNumber = 0;
  /** Scenario-wired accessor keeps membership on canonical voices across map replacement. */
  voices?: () => Map<string, VoiceResponseModel>;

  listCollections() {
    return { collections: structuredClone([...this.collections.values()].sort((a, b) =>
      a.title.localeCompare(b.title) || a.collection_id.localeCompare(b.collection_id))) };
  }

  getCollection(id: string) {
    const collection = this.collections.get(id);
    return collection ? structuredClone(collection) : undefined;
  }

  createCollection(input: CreateCollection): Collection {
    let collection_id: string;
    do { collection_id = `sim-collection-created-${++this.nextCollectionNumber}`; }
    while (this.collections.has(collection_id));
    const collection: Collection = { collection_id, title: input.title, icon: input.icon, permission_on_resource: "admin" };
    this.collections.set(collection_id, collection);
    return structuredClone(collection);
  }

  updateCollection(id: string, input: UpdateCollection = {}) {
    const collection = this.collections.get(id);
    if (!collection) return undefined;
    if (input.title != null) collection.title = input.title;
    if (input.icon != null) collection.icon = input.icon;
    return structuredClone(collection);
  }

  deleteCollection(id: string) {
    if (!this.collections.has(id)) return undefined;
    for (const voice of this.voiceState().values()) {
      if (voice.collection_ids?.includes(id)) voice.collection_ids = voice.collection_ids.filter((value) => value !== id);
    }
    this.collections.delete(id);
    return { collection_id: id };
  }

  addVoice(id: string, voiceId: string): MembershipResult {
    return this.changeMembership(id, voiceId, true);
  }

  removeVoice(id: string, voiceId: string): MembershipResult {
    return this.changeMembership(id, voiceId, false);
  }

  private changeMembership(id: string, voiceId: string, add: boolean): MembershipResult {
    if (!this.collections.has(id)) return { error: "collection_not_found" };
    const voice = this.voiceState().get(voiceId);
    if (!voice) return { error: "voice_not_found" };
    const ids = voice.collection_ids ?? [];
    voice.collection_ids = add ? [...new Set([...ids, id])] : ids.filter((value) => value !== id);
    return { value: { collection_id: id, voice_id: voiceId } };
  }

  private voiceState() {
    if (!this.voices) throw new Error("Collection voice state is not initialized; run startup or reset");
    return this.voices();
  }
}
