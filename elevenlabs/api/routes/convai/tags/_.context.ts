import type { ConversationTagResponseModel as Tag } from "../../../types/v1/components/schemas/ConversationTagResponseModel.js";
import type { CreateConversationTagRequestModel as CreateTag } from "../../../types/v1/components/schemas/CreateConversationTagRequestModel.js";
import type { PatchConversationTagRequestModel as PatchTag } from "../../../types/v1/components/schemas/PatchConversationTagRequestModel.js";
import type { GetConversationTagsPageResponseModel as TagPage } from "../../../types/v1/components/schemas/GetConversationTagsPageResponseModel.js";

type Result<T> = { value: T; error?: never } | { error: "invalid_tag" | "invalid_tag_query" | "tag_not_found"; value?: never };

export class Context {
  tags = new Map<string, Tag>();
  nextTagNumber = 0;
  creationTimeUnix = 0;
  workspaceId = "";
  ownerUserId = "";

  listTags(query: { page_size?: number; cursor?: string | null } = {}): Result<TagPage> {
    const size = query.page_size ?? 100;
    const cursor = query.cursor;
    if (!Number.isInteger(size) || size < 1 || size > 100 ||
      (cursor != null && (!/^(0|[1-9][0-9]*)$/.test(cursor) || !Number.isSafeInteger(Number(cursor))))) {
      return { error: "invalid_tag_query" };
    }
    const offset = Number(cursor ?? 0);
    const tags = [...this.tags.values()].sort((a, b) => b.created_at_unix_secs - a.created_at_unix_secs || a.tag_id.localeCompare(b.tag_id));
    const has_more = offset + size < tags.length;
    return { value: { conversation_tags: structuredClone(tags.slice(offset, offset + size)), has_more, next_cursor: has_more ? String(offset + size) : null } };
  }

  getTag(id: string) {
    const tag = this.tags.get(id);
    return tag ? structuredClone(tag) : undefined;
  }

  createTag(input: CreateTag): Result<Tag> {
    if (!validFields(input, true)) return { error: "invalid_tag" };
    let tag_id: string;
    do { tag_id = `sim-tag-created-${++this.nextTagNumber}`; } while (this.tags.has(tag_id));
    const tag: Tag = { tag_id, title: input.title, description: input.description ?? null,
      workspace_id: this.workspaceId, owner_user_id: this.ownerUserId,
      created_at_unix_secs: this.creationTimeUnix + this.nextTagNumber };
    this.tags.set(tag_id, tag);
    return { value: structuredClone(tag) };
  }

  updateTag(id: string, input: PatchTag): Result<Tag> {
    const tag = this.tags.get(id);
    if (!tag) return { error: "tag_not_found" };
    if (!validFields(input, false)) return { error: "invalid_tag" };
    if (input.title != null) tag.title = input.title;
    if (input.description !== undefined) tag.description = input.description;
    return { value: structuredClone(tag) };
  }

  deleteTag(id: string) { return this.tags.delete(id); }
}

function validFields(input: PatchTag, creating: boolean) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return false;
  if (creating || input.title != null) {
    if (typeof input.title !== "string" || [...input.title].length < 1 || [...input.title].length > 120) return false;
  }
  return input.description == null || (typeof input.description === "string" && [...input.description].length <= 1000);
}
