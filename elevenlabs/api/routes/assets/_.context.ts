import type { MultipartFile } from "../../counterfact-types/index.js";
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
  records = new Map<string, Asset & { upload?: MultipartFile }>();
  nextUpload = 0;
  uploadDefaults:
    { maxBytes: number; timestamp: number; maxName: number } | undefined;
  upload(name: unknown, file: unknown) {
    const config = this.uploadDefaults;
    if (
      !config ||
      typeof name !== "string" ||
      !name.trim() ||
      name.length > config.maxName
    )
      throw new AssetError(400, "invalid_asset_upload");
    const upload = copyUpload(file, config.maxBytes, config.maxName);
    let next = this.nextUpload;
    while (this.records.has(`sim-asset-upload-${next}`)) next++;
    const asset_id = `sim-asset-upload-${next}`;
    const record = {
      asset_id,
      name,
      mime_type: upload.contentType,
      created_at_unix: config.timestamp,
      content_url: `https://simulator.invalid/assets/${asset_id}/content`,
      upload,
    };
    this.records.set(asset_id, record);
    this.nextUpload = next + 1;
    return this.get(asset_id);
  }
  getUpload(id: string) {
    this.get(id);
    const upload = this.records.get(id)!.upload;
    return upload ? structuredClone(upload) : undefined;
  }
  get(id: string) {
    const record = this.records.get(id);
    if (!record) throw new AssetError(404, "asset_not_found");
    const { upload, ...metadata } = record;
    return structuredClone(metadata);
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
      assets: rows
        .slice(offset, offset + size)
        .map((record) => this.get(record.asset_id)),
      next_cursor: has_more ? String(offset + size) : null,
      has_more,
    };
  }
}

/** Validate and copy a parsed upload; bytes remain opaque, never provider processed. */
export function copyUpload(
  value: unknown,
  maxBytes: number,
  maxName: number,
): MultipartFile {
  const file = value as Partial<MultipartFile> | null;
  if (
    !file ||
    !(file.data instanceof Uint8Array) ||
    file.size !== file.data.byteLength ||
    file.size < 1 ||
    file.size > maxBytes ||
    typeof file.filename !== "string" ||
    !file.filename.trim() ||
    file.filename.length > maxName ||
    typeof file.contentType !== "string" ||
    !/^[a-zA-Z0-9!#$&^_.+-]+\/[a-zA-Z0-9!#$&^_.+-]+$/.test(file.contentType)
  )
    throw new AssetError(400, "invalid_asset_upload");
  return {
    data: new Uint8Array(file.data),
    size: file.size,
    filename: file.filename,
    contentType: file.contentType,
  };
}
