import type { AudioIsolationHistoryItemResponseModel as Item } from "../../../types/v1/components/schemas/AudioIsolationHistoryItemResponseModel.js";
export type StoredIsolation = { item: Item; text: string };
export class IsolationHistoryError extends Error {
  override name = "IsolationHistoryError";
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}
export class Context {
  records = new Map<string, StoredIsolation>();
  list(query: Record<string, unknown> = {}) {
    const size = query.page_size ?? 100,
      page = query.page ?? 1;
    if (
      typeof size !== "number" ||
      !Number.isInteger(size) ||
      size < 1 ||
      size > 1000 ||
      typeof page !== "number" ||
      !Number.isSafeInteger(page) ||
      page < 1 ||
      (query.search != null && typeof query.search !== "string")
    ) {
      throw new IsolationHistoryError(400, "invalid_isolation_history_query");
    }
    const search =
      typeof query.search === "string" ? query.search.toLowerCase() : undefined;
    const rows = [...this.records.values()].filter(
      ({ item, text }) =>
        search === undefined ||
        `${item.title ?? ""}\n${text}`.toLowerCase().includes(search),
    );
    rows.sort(
      (a, b) =>
        b.item.created_at_unix - a.item.created_at_unix ||
        a.item.id.localeCompare(b.item.id),
    );
    const start = search === undefined ? 0 : (page - 1) * size,
      end = start + size;
    return {
      items: structuredClone(rows.slice(start, end).map((r) => r.item)),
      has_more: end < rows.length,
    };
  }
  delete(id: string) {
    if (!this.records.delete(id))
      throw new IsolationHistoryError(404, "isolation_history_item_not_found");
  }
}
