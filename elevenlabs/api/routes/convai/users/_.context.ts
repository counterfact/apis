import type { GetConversationResponseModel as Conversation } from "../../../types/v1/components/schemas/GetConversationResponseModel.js";
import type { GetConversationUsersPageResponseModel as Page } from "../../../types/v1/components/schemas/GetConversationUsersPageResponseModel.js";
import type { ConversationUserResponseModel as User } from "../../../types/v1/components/schemas/ConversationUserResponseModel.js";
export class ConversationUserError extends Error {
  override name = "ConversationUserError";
  status = 400;
  code = "invalid_conversation_user_query";
}
const invalid = (): never => {
  throw new ConversationUserError(
    "Invalid or unsupported conversation-user query",
  );
};
const integer = (
  v: unknown,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
): number | undefined => {
  if (v == null) return undefined;
  const n = typeof v === "string" && /^\d+$/.test(v) ? Number(v) : v;
  if (typeof n !== "number" || !Number.isSafeInteger(n) || n < min || n > max)
    return invalid();
  return n;
};
export class Context {
  conversations: () => Map<string, Conversation> = () => new Map();
  list(q: Record<string, unknown>): Page {
    const size = integer(q.page_size, 1, 100) ?? 30,
      cursor = q.cursor ?? "0";
    if (typeof cursor !== "string" || !/^\d+$/.test(cursor)) return invalid();
    const offset = integer(cursor)!;
    for (const key of ["agent_id", "branch_id", "search"])
      if (q[key] != null && typeof q[key] !== "string") return invalid();
    if (typeof q.agent_id === "string" && q.agent_id.startsWith("seng_"))
      return invalid();
    const before = integer(q.call_start_before_unix),
      after = integer(q.call_start_after_unix),
      sort = q.sort_by ?? "last_contact_unix_secs",
      direction = q.sort_direction ?? "desc";
    if (
      (before !== undefined && after !== undefined && after > before) ||
      !["last_contact_unix_secs", "conversation_count"].includes(
        String(sort),
      ) ||
      !["asc", "desc"].includes(String(direction))
    )
      return invalid();
    const groups = new Map<string, Conversation[]>();
    for (const c of this.conversations().values()) {
      const time = c.metadata.start_time_unix_secs;
      if (
        !c.user_id ||
        (q.agent_id != null && c.agent_id !== q.agent_id) ||
        (q.branch_id != null && c.branch_id !== q.branch_id) ||
        (q.search != null && c.user_id !== q.search) ||
        (before !== undefined && time > before) ||
        (after !== undefined && time < after)
      )
        continue;
      const rows = groups.get(c.user_id) ?? [];
      rows.push(c);
      groups.set(c.user_id, rows);
    }
    const users: User[] = [...groups].map(([user_id, rows]) => {
      rows.sort(
        (a, b) =>
          b.metadata.start_time_unix_secs - a.metadata.start_time_unix_secs ||
          a.conversation_id.localeCompare(b.conversation_id),
      );
      const latest = rows[0];
      return {
        user_id,
        conversation_count: rows.length,
        first_contact_unix_secs:
          rows[rows.length - 1].metadata.start_time_unix_secs,
        last_contact_unix_secs: latest.metadata.start_time_unix_secs,
        last_contact_agent_id: latest.agent_id ?? null,
        last_contact_agent_name: latest.agent_name ?? null,
        last_contact_conversation_id: latest.conversation_id,
        sentiment: {
          scored_conversation_count: 0,
          positive_count: 0,
          neutral_count: 0,
          negative_count: 0,
          average_sentiment_score: null,
          average_frustration_score: null,
          recent_scored_conversation_count: 0,
          recent_positive_count: 0,
          recent_neutral_count: 0,
          recent_negative_count: 0,
          recent_average_sentiment_score: null,
          recent_average_frustration_score: null,
        },
        most_frustrated_conversations: [],
      };
    });
    users.sort(
      (a, b) =>
        (direction === "asc" ? 1 : -1) *
          (a[sort as "last_contact_unix_secs" | "conversation_count"] -
            b[sort as "last_contact_unix_secs" | "conversation_count"]) ||
        a.user_id.localeCompare(b.user_id),
    );
    const page = users.slice(offset, offset + size),
      has_more = offset + page.length < users.length;
    return {
      users: structuredClone(page),
      has_more,
      next_cursor: has_more ? String(offset + page.length) : null,
    };
  }
}
