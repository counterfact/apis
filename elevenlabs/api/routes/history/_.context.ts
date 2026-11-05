import type { SpeechHistoryItemResponseModel } from "../../types/v1/components/schemas/SpeechHistoryItemResponseModel.js";
import type { GetSpeechHistoryResponseModel } from "../../types/v1/components/schemas/GetSpeechHistoryResponseModel.js";
import type { HTTP_GET_Query as HistoryQuery } from "../../types/v1/paths/history.types.js";

type HistoryListResult =
  | { page: GetSpeechHistoryResponseModel; error?: never }
  | { page?: never; error: string };

export class Context {
  history = new Map<string, SpeechHistoryItemResponseModel>();
  audio = new Map<string, Uint8Array>();

  getHistoryItem(id: string) {
    const item = this.history.get(id);
    return item ? structuredClone(item) : undefined;
  }

  deleteHistoryItem(id: string) {
    this.audio.delete(id);
    return this.history.delete(id);
  }

  listHistory(query: HistoryQuery): HistoryListResult {
    const size = query.page_size ?? 100;
    if (!Number.isInteger(size) || size < 1 || size > 1000) {
      return { error: "page_size must be an integer from 1 to 1000" };
    }
    if (query.sort_direction != null && !["asc", "desc"].includes(query.sort_direction)) {
      return { error: "sort_direction must be asc or desc" };
    }
    const direction = query.sort_direction === "asc" ? 1 : -1;
    let items = [...this.history.values()].sort((a, b) =>
      direction * (a.date_unix - b.date_unix || a.history_item_id.localeCompare(b.history_item_id)),
    );
    // Locate the cursor in the complete sorted collection before applying filters.
    if (query.start_after_history_item_id != null) {
      const cursor = items.findIndex((item) => item.history_item_id === query.start_after_history_item_id);
      if (cursor < 0) return { error: "start_after_history_item_id does not identify a history item" };
      items = items.slice(cursor + 1);
    }
    const search = query.search?.toLowerCase();
    items = items.filter((item) =>
      (query.voice_id == null || item.voice_id === query.voice_id) &&
      (query.model_id == null || item.model_id === query.model_id) &&
      (query.source == null || item.source === query.source) &&
      (query.date_before_unix == null || item.date_unix < query.date_before_unix) &&
      (query.date_after_unix == null || item.date_unix >= query.date_after_unix) &&
      (!search || (item.text ?? "").toLowerCase().includes(search)),
    );
    const history = structuredClone(items.slice(0, size));
    const last = history.at(-1);
    return { page: {
      history,
      has_more: items.length > history.length,
      last_history_item_id: last?.history_item_id ?? null,
      scanned_until: last?.date_unix ?? null,
    } };
  }

}
