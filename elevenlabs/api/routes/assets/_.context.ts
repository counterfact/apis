import type { AssetResponse as Asset } from "../../types/v1/components/schemas/AssetResponse.js";
export class AssetError extends Error {
  override name = "AssetError";
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}
const invalid = (): never => {
  throw new AssetError(400, "invalid_asset_query");
};
export class Context {
  records = new Map<string, Asset>();
  get(id: string) {
    const record = this.records.get(id);
    if (!record) throw new AssetError(404, "asset_not_found");
    return structuredClone(record);
  }
  delete(id: string) {
    this.get(id);
    this.records.delete(id);
  }
  list(query: Record<string, unknown> = {}) {
    const size = query.page_size ?? 30,
      cursor = query.cursor ?? "0";
    if (
      typeof size !== "number" ||
      !Number.isInteger(size) ||
      size < 1 ||
      size > 100 ||
      typeof cursor !== "string" ||
      !/^(0|[1-9]\d*)$/.test(cursor) ||
      !Number.isSafeInteger(Number(cursor)) ||
      (query.search != null && typeof query.search !== "string")
    )
      return invalid();
    const search =
      typeof query.search === "string" ? query.search.toLowerCase() : "";
    const rows = [...this.records.values()].filter((asset) =>
      asset.name.toLowerCase().includes(search),
    );
    rows.sort(
      (a, b) =>
        b.created_at_unix - a.created_at_unix ||
        a.asset_id.localeCompare(b.asset_id),
    );
    const offset = Number(cursor),
      has_more = offset + size < rows.length;
    return {
      assets: structuredClone(rows.slice(offset, offset + size)),
      next_cursor: has_more ? String(offset + size) : null,
      has_more,
    };
  }
}
