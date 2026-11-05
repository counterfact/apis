import type { SpeechHistoryItemResponseModel } from "../../types/v1/components/schemas/SpeechHistoryItemResponseModel.js";
import type { GetSpeechHistoryResponseModel } from "../../types/v1/components/schemas/GetSpeechHistoryResponseModel.js";
import type { HTTP_GET_Query as HistoryQuery } from "../../types/v1/paths/history.types.js";
import { crc32 } from "node:zlib";

export class HistoryMediaError extends Error {
  override name = "HistoryMediaError";
  constructor(public status: number, public code: string) { super(code); }
}
const fail = (status: number, code: string): never => { throw new HistoryMediaError(status, code); };

/** A deterministic uncompressed ZIP. Stored entries preserve the retained bytes. */
function zip(entries: { name: string; audio: Uint8Array }[]) {
  const files: Buffer[] = [], directory: Buffer[] = [];
  let offset = 0;
  for (const entry of entries) {
    const name = Buffer.from(entry.name, "utf8"), audio = Buffer.from(entry.audio), checksum = crc32(audio);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x21, 12); // Fixed 1980-01-01 UTC, no wall-clock dependency.
    local.writeUInt32LE(checksum, 14); local.writeUInt32LE(audio.length, 18); local.writeUInt32LE(audio.length, 22);
    local.writeUInt16LE(name.length, 26);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x21, 14); central.writeUInt32LE(checksum, 16);
    central.writeUInt32LE(audio.length, 20); central.writeUInt32LE(audio.length, 24);
    central.writeUInt16LE(name.length, 28); central.writeUInt32LE(offset, 42);
    files.push(local, name, audio); directory.push(central, name);
    offset += local.length + name.length + audio.length;
  }
  const central = Buffer.concat(directory), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(central.length, 12); end.writeUInt32LE(offset, 16);
  return new Uint8Array(Buffer.concat([...files, central, end]));
}

type HistoryListResult =
  | { page: GetSpeechHistoryResponseModel; error?: never }
  | { page?: never; error: string };

export class Context {
  history = new Map<string, SpeechHistoryItemResponseModel>();
  audio = new Map<string, Uint8Array>();

  private retainedAudio(id: string) {
    const item = this.history.get(id);
    if (!item) return fail(404, "history_item_not_found");
    const audio = this.audio.get(id);
    if (!audio?.length) return fail(404, "history_audio_unavailable");
    if (item.content_type !== "audio/mpeg") return fail(400, "unsupported_history_audio_format");
    return audio;
  }

  getAudio(id: string) {
    return new Uint8Array(this.retainedAudio(id));
  }

  download(input: unknown) {
    if (input === null || typeof input !== "object" || Array.isArray(input)) return fail(400, "invalid_history_download");
    const body = input as Record<string, unknown>, ids = body.history_item_ids;
    if (Object.keys(body).some(key => !["history_item_ids", "output_format"].includes(key)) ||
        !Array.isArray(ids) || ids.length < 1 || ids.length > 100 || ids.some(id => typeof id !== "string" || !id.trim()))
      return fail(400, "invalid_history_download");
    if (body.output_format != null && body.output_format !== "default") return fail(400, "unsupported_history_output_format");
    // Resolve the complete request before allocating an archive. A missing member
    // never yields a partial download, and duplicate IDs retain first occurrence.
    const entries = [...new Set(ids as string[])].map(id => {
      const audio = this.retainedAudio(id);
      let name: string;
      try { name = `${encodeURIComponent(id)}.mp3`; } catch { return fail(400, "invalid_history_download"); }
      return { name, audio };
    });
    if (entries.some(entry => Buffer.byteLength(entry.name) > 65535) || entries.reduce((n, entry) => n + entry.audio.length, 0) > 16 * 1024 * 1024)
      return fail(400, "history_download_too_large");
    return zip(entries);
  }

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
